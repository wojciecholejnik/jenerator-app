import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneratorService } from 'src/app/main-wrapper/generator/generator.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Question, QuestionsFilter, QuestionType } from 'src/app/shared/models';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnDestroy {

  @Input() questions!: any;
  @Input() loading!: boolean;
  searchPhrase = '';
  questionsFilter : QuestionsFilter = {
    content: '',
    author: '',
    type: '',
    status: '',
  }
  type: QuestionType | string = '';
  deletModalIsOpen = false;
  selectedQuestion?: Question;
  editModalIsOpen = false;
  previewModalIsOpen = false;
  private isNewTest$?: Subscription;
  isNewTest = '';

  constructor(private questionService: QuestionsService, private generatorService: GeneratorService) { }

  ngOnInit(): void {
    this.isNewTest$ = this.generatorService.newTest$.subscribe(data => this.isNewTest = data);
  }

  ngOnDestroy(): void {
    this.isNewTest$?.unsubscribe();
  }

  onFilterChange(): void {
    this.questionService.filterQuestions(this.questionsFilter)
  }

  clearFilter(filterControl?: 'content' | 'author' | 'type' | 'status'): void {
    if (!filterControl) {
      this.questionsFilter = {
        content: '',
        author: '',
        type: '',
        status: '',
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

}
