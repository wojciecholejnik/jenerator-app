import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneratorService } from 'src/app/main-wrapper/generator/generator.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category, PaginationInfo, Question, QuestionsFilter, QuestionSpecies, QuestionType, Tag, translateQuestionSpecies } from 'src/app/shared/models';
import { TagsService } from '../../tags/tags.service';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() questions!: any;
  @Input() loading!: boolean;
  @Input() selectedCategory!: Category;
  @ViewChild('questionsTable', { read: ElementRef }) table: any;
  questionsToShow: Question[] = [];
  searchPhrase = '';
  questionsFilter : QuestionsFilter = {
    content: '',
    author: '',
    type: '',
    status: '',
    species: undefined,
    tags: ''
  }
  type: QuestionType | string = '';
  deletModalIsOpen = false;
  selectedQuestion?: Question;
  editModalIsOpen = false;
  previewModalIsOpen = false;
  private isNewTest$?: Subscription;
  isNewTest = '';

  constructor(
    private questionService: QuestionsService,
    private generatorService: GeneratorService,
    private tagsService: TagsService
  ) { }

  ngOnInit(): void {
    this.isNewTest$ = this.generatorService.newTest$.subscribe(data => this.isNewTest = data);
  }

  ngOnChanges(): void {
    if (!this.questions) return

    if(this.minIndex + this.numberOfRows > this.questions.length) {
      this.minIndex = 0;
      this.maxIndex = this.numberOfRows;
    }
    this.countPages();

    this.setButtons();
    this.questionsToShow = this.questions.slice(this.minIndex, this.maxIndex);
  }

  ngOnDestroy(): void {
    this.isNewTest$?.unsubscribe();
  }

  onFilterChange(event?: any): void {
    if (event && event.target.id === "species") {
      this.questionsFilter.species = event.target.value === 'undefined' ? undefined : Number(event.target.value)
    }
    this.questionService.filterQuestions(this.questionsFilter)
  }

  clearFilter(filterControl?: 'content' | 'author' | 'type' | 'status' | 'species' | 'tags'): void {
    if (!filterControl) {
      this.questionsFilter = {
        content: '',
        author: '',
        type: '',
        status: '',
        species: undefined,
        tags: ''
      }
    } else {
      if (filterControl === 'content') {
        this.questionsFilter.content = ''
      } else if (filterControl === 'author') {
        this.questionsFilter.author = ''
      } else if (filterControl === 'type') {
        this.questionsFilter.type = ''
      } else if (filterControl === 'status') {
        this.questionsFilter.status = ''
      } else if (filterControl === 'species') {
        this.questionsFilter.species = undefined
      } else if (filterControl === 'tags') {
        this.questionsFilter.tags = ''
      }
    }
    this.onFilterChange();
  }

  toggelDeleteModalIsOpen(question?: Question): void {
    if (question) {
      this.selectedQuestion = question
    } else {
      this.selectedQuestion = undefined
    }
    this.deletModalIsOpen = !this.deletModalIsOpen;
  }

  toggleEditModal(question?: Question): void {
    if (question) {
      this.selectedQuestion = question
    } else {
      this.selectedQuestion = undefined
    }
    this.editModalIsOpen = !this.editModalIsOpen;
  }

  togglePreviewModal(question?: Question): void {
    if (question) {
      this.selectedQuestion = question
    } else {
      this.selectedQuestion = undefined
    }
    this.previewModalIsOpen = !this.previewModalIsOpen;
  }

  addToNewTest(question: Question): void {
    this.generatorService.addQuestion(question);
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

  openTagsEditor(): void {
    this.tagsService.openTagEditor(this.selectedCategory)
  }

  showTags(tags: Tag[]): string {
    return tags.map(tag => tag.name).join(', ')
  }

  translateQuestionSpeciesName = translateQuestionSpecies;

  numberOfRows = 10;
  minIndex=0;
  maxIndex=this.numberOfRows;
  btnPrevDisabled = true;
  btnResetDisabled = true;
  btnNextDisabled = this.questions ? this.questions.length > this.numberOfRows : true;
  pagesAmount = 0;
  showingPage = 1;
  allQuestionsAmount = 0;

  changeRange(direction: 'asc' | 'desc' | 'reset') {
    if (direction === 'asc' && this.minIndex + this.numberOfRows < this.questions.length) {
      this.minIndex += this.numberOfRows;
      this.maxIndex += this.numberOfRows;
      this.showingPage ++
    } else if (direction === 'desc' && this.minIndex > 0) {
      this.minIndex -= this.numberOfRows;
      this.maxIndex -= this.numberOfRows;
      this.showingPage --
    } else if (direction === 'reset') {
      this.minIndex = 0;
      this.maxIndex = this.numberOfRows;
      this.table.nativeElement.scrollTop = 0;
      this.showingPage = 1;
    }

    this.setButtons();
    this.countPages();
    this.questionsToShow = this.questions.slice(this.minIndex, this.maxIndex).map((claim: any) => {
      return {
        ...claim,
        isChecked: false,
      }
    });
  }

  setButtons(){
    this.btnNextDisabled = this.maxIndex >= this.questions.length;
    this.btnPrevDisabled = this.minIndex <= 0;
    this.btnResetDisabled = this.minIndex <= 0;
  }

  countPages(): void {
    this.pagesAmount = Math.ceil(this.questions.length / this.numberOfRows);
    this.allQuestionsAmount = this.questions.length; 
  }

  setPaginationInfo(): PaginationInfo {
    return {
      allQuestionsAmount: this.allQuestionsAmount,
      showingPage: this.showingPage,
      pagesAmount: this.pagesAmount,
      btnNextDisabled: this.btnNextDisabled,
      btnPrevDisabled: this.btnPrevDisabled,
      btnResetDisabled: this.btnResetDisabled
    }
  }

}
