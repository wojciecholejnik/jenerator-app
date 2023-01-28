import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category, Question, QuestionToSaveDTO, QuestionType } from 'src/app/shared/models';

@Component({
  selector: 'app-question-preview',
  templateUrl: './question-preview.component.html',
  styleUrls: ['./question-preview.component.scss']
})
export class QuestionPreviewComponent implements OnInit, OnDestroy {

  @Input() question!: Question;
  @Input() categories!: Category[];
  @Input() disabled?: boolean = true;
  @Input() previewOnly?: boolean;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
  selectedCategory?: Category;
  selectedType: QuestionType | string = '';
  private selectedCategory$?: Subscription;
  questionForm!: FormGroup;
  imgSrc = '';
  modalType = 'addNewQuestion'

  constructor(
    private loginService: LoginService,
    private questionService: QuestionsService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.selectedCategory$ = this.questionService.selectedCategory$.subscribe(data => {
      if (data) {
        this.selectedCategory = data;
      }
    })
    if (!this.question) {
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
        img: ['']
      })
    } else {
      // this.selectedCategory = this.question.category;
      this.selectType(this.question.type)
      this.questionForm = this.fb.group({
        questionContent: [this.question.questionContent, Validators.required],
        answers: this.question.type !== 'open' ? this.fb.group({
          ans1: this.fb.group({
            content: [this.question.answers[0].content],
            isRight: [this.question.answers[0].isRight]
          }),
          ans2: this.fb.group({
            content: [this.question.answers[1].content],
            isRight: [this.question.answers[1].isRight]
          }),
          ans3: this.fb.group({
            content: [this.question.answers[2].content],
            isRight: [this.question.answers[2].isRight]
          }),
          ans4: this.fb.group({
            content: [this.question.answers[3].content],
            isRight: [this.question.answers[3].isRight]
          })
        }) : [],
        img: [this.question.img]
      })
    }
  }

  ngOnDestroy(): void {
    this.selectedCategory$?.unsubscribe();
  }

  selectType(type: QuestionType) {
    this.selectedType = type
  }

  closeModal(): void {
    this.onCloseModal.emit();
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
          this.closeModal();
        },
        error: () => {
          // handle add question creation
        }
      })
    }
  }

  isValidToSave(): boolean {
    if (!this.selectedCategory && !this.selectedType) {
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
      author: this.loginService.getAuthor()._id
    }
    return question
  }

  

}
