import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category, Question, QuestionSpecies, QuestionToSaveDTO, QuestionType, Tag, translateQuestionSpecies } from 'src/app/shared/models';
import { TagsService } from '../../tags/tags.service';
import { ToastService } from 'src/app/shared/toast-service/toast.service';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss'],
  providers: [DatePipe]
})
export class QuestionPreviewComponent implements OnInit, OnDestroy {

  @Input() question!: Question;
  @Input() categories!: Category[];
  @Input() disabled?: boolean = true;
  @Input() previewOnly?: boolean;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
  selectedCategory?: Category;
  selectedType: QuestionType | string = '';
  selectedSpecies: QuestionSpecies | undefined;
  questionForm!: FormGroup;
  imgSrc = '';
  modalType = 'addNewQuestion'
  tags: Tag[] | undefined = [];
  
  private _selectedCategory?: Subscription;
  private _tags?: Subscription;
  
  constructor(
    private loginService: LoginService,
    private questionService: QuestionsService,
    private fb: FormBuilder,
    private tagsService: TagsService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this._selectedCategory = this.questionService.selectedCategory$.subscribe(data => {
      if (data) {
        this.selectedCategory = data;
        setTimeout(() => this.tagsService.getTags(data._id))
      }
    })

    this._tags = this.tagsService.tags.subscribe(tags => {
      this.tags = tags;
    this.prepareForm(this.question && this.question.type ? this.question.type : 'singleSelect')
    
    });
  }

  ngOnDestroy(): void {
    this._selectedCategory?.unsubscribe();
    this._tags?.unsubscribe();
  }

  selectType(type: QuestionType) {
    this.selectedType = type
  }

  onTypeSelect(type: QuestionType) {
    this.prepareForm(type)
  }

  selectSpecies(species: QuestionSpecies) {
    this.selectedSpecies = species
  }

  closeModal(): void {
    this.onCloseModal.emit();
  }

  setFormWithoutQuestion(): void {
    this.questionForm = this.fb.group({
      questionContent: ['', Validators.required],
      answers: this.fb.group({
        ans1: this.fb.group({
          content: [''],
          isRight: [true]
        }),
        ans2: this.fb.group({
          content: [''],
          isRight: [false]
        }),
        ans3: this.fb.group({
          content: [''],
          isRight: [false]
        }),
        ans4: this.fb.group({
          content: [''],
          isRight: [false]
        })
      }),
      img: [''],
      blocked: [false],
      tags: this.fb.group(this.tags ? this.tags.map(tag => {
        return this.fb.group({
          name: [tag.name],
          isChecked: [false],
          _id: [tag._id]
        })
      }) : [])
    })
  }

  setFormWithQuestion(type: QuestionType): void {
    this.questionForm = this.fb.group({
      questionContent: [this.question.questionContent, Validators.required],
      answers: type !== 'open' ? this.fb.group({
        ans1: this.fb.group({
          content: [this.question.answers[0] ? this.question.answers[0].content : '' ],
          isRight: [this.question.answers[0] ? this.question.answers[0].isRight : false]
        }),
        ans2: this.fb.group({
          content: [this.question.answers[1] ? this.question.answers[1].content : ''],
          isRight: [this.question.answers[1] ? this.question.answers[1].isRight : false]
        }),
        ans3: this.fb.group({
          content: [this.question.answers[2] ? this.question.answers[2].content : ''],
          isRight: [this.question.answers[2] ? this.question.answers[2].isRight : false]
        }),
        ans4: this.fb.group({
          content: [this.question.answers[3] ? this.question.answers[3].content : ''],
          isRight: [this.question.answers[3] ? this.question.answers[3].isRight : false]
        })
      }) : [],
      img: [this.question.img],
      blocked: [this.question.blocked],
      tags: this.fb.group(this.tags ? this.tags.map(tag => {
        return this.fb.group({
          name: new FormControl({value: tag.name, disabled: true}),
          isChecked: [this.question.tags?.find(item => item._id === tag._id) ? true : false],
          _id: [tag._id]
        })
      }): [])
    })
  }

  prepareForm(type: QuestionType): void {
    if (!this.question) {
      this.modalType = 'addNewQuestion';
      this.setFormWithoutQuestion();
    } else {
      this.modalType = 'editQuestion';
      this.selectedSpecies = this.question.species;
      this.setFormWithQuestion(type)
    }
    this.selectType(type);
  }

  setSrc() {
    this.imgSrc = this.questionForm.value.img
  }

  checkboxChange(ansNr: string) {
    if (this.selectedType === 'singleSelect') {
      
      const answersGroup = this.questionForm.controls['answers'] as any;
      
      if (ansNr === 'ans1') {
        answersGroup.controls['ans1'].controls['isRight'].setValue(true);
        answersGroup.controls['ans2'].controls['isRight'].setValue(false);
        answersGroup.controls['ans3'].controls['isRight'].setValue(false);
        answersGroup.controls['ans4'].controls['isRight'].setValue(false);
      } else if (ansNr === 'ans2') {
        answersGroup.controls['ans1'].controls['isRight'].setValue(false);
        answersGroup.controls['ans2'].controls['isRight'].setValue(true);
        answersGroup.controls['ans3'].controls['isRight'].setValue(false);
        answersGroup.controls['ans4'].controls['isRight'].setValue(false);
      } else if (ansNr === 'ans3') {
        answersGroup.controls['ans1'].controls['isRight'].setValue(false);
        answersGroup.controls['ans2'].controls['isRight'].setValue(false);
        answersGroup.controls['ans3'].controls['isRight'].setValue(true);
        answersGroup.controls['ans4'].controls['isRight'].setValue(false);
      } else if (ansNr === 'ans4') {
        answersGroup.controls['ans1'].controls['isRight'].setValue(false);
        answersGroup.controls['ans2'].controls['isRight'].setValue(false);
        answersGroup.controls['ans3'].controls['isRight'].setValue(false);
        answersGroup.controls['ans4'].controls['isRight'].setValue(true);
      }
    }
  }

  onSubmit() {
    if (this.isValidToSave() && this.modalType === 'addNewQuestion') {
      this.questionService.addQuestion(this.mapQuestion()).subscribe({
        next: (res) => {
          this.questionService.questions$.next(res);
          this.questionService.allQuestions = res;
          this.questionService.filterQuestions(this.questionService.questionFilter$.getValue());
          this.toastService.show("Pytanie zostało utworzone.", { classname: 'bg-success text-light', delay: 1500 })
          this.closeModal();
        },
        error: (e) => {
          this.toastService.show(e.error.message, { classname: 'bg-danger text-light', autohide: false })
        }
      })
    }
    if (this.isValidToSave() && this.modalType === 'editQuestion') {
      this.questionService.editQuestion(this.mapQuestion()).subscribe({
        next: (res) => {
          this.questionService.questions$.next(res);
          this.questionService.allQuestions = res;
          this.questionService.filterQuestions(this.questionService.questionFilter$.getValue());
          this.closeModal();
        },
        error: () => {
          this.toastService.show("Nie udało się edytować pytania.", { classname: 'bg-danger text-light', autohide: false })
        }
      })
    }
  }

  isValidToSave(): boolean {
    if (!this.questionForm) return false
    if (!this.selectedCategory && !this.selectedType) {
      return false
    } 
    
    if (this.selectedSpecies === undefined) {
      return false
    }

    if (this.selectedType === 'open' && this.questionForm.value.questionContent && this.questionForm.value.questionContent.length) {
      return true
    }

    if (this.selectedType !== 'open' && (
      this.questionForm.value.answers.ans1.isRight
      || this.questionForm.value.answers.ans2.isRight
      || this.questionForm.value.answers.ans3.isRight
      || this.questionForm.value.answers.ans4.isRight
      )
    ) {
      return true
    }

    return false
  }

  mapQuestion(): QuestionToSaveDTO {
    const question: QuestionToSaveDTO = {
      category: this.selectedCategory?._id || '',
      type: this.selectedType,
      questionContent: this.questionForm.value.questionContent,
      answers: this.selectedType !== 'open' ?
      [
        this.questionForm.value.answers.ans1,
        this.questionForm.value.answers.ans2,
        this.questionForm.value.answers.ans3,
        this.questionForm.value.answers.ans4,
      ] : [],
      img: this.questionForm.value.img,
      author: this.loginService.getAuthor()._id,
      blocked: this.questionForm.value.blocked, 
      species: this.selectedSpecies,
      tags: this.questionForm.value.tags ? Object.values(this.questionForm.value.tags).filter((tag: any) => tag.isChecked).map((item:any) => item._id) : []
    }
    if (this.modalType === 'editQuestion') {
      question._id = this.question._id
    }
    return question
  }

  translateTypeNames(type: QuestionType): string {
    if (type === 'singleSelect') {
      return 'single'
    } else if (type === 'multiSelect') {
      return 'multi'
    } else if (type === 'open') {
      return 'open'
    } else {
      return ''
    }
  }

  translateQuestionSpeciesName = translateQuestionSpecies;

}
