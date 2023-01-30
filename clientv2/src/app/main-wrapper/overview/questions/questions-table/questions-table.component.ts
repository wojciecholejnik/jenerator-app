import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneratorService } from 'src/app/main-wrapper/generator/generator.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Question, QuestionType } from 'src/app/shared/models';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit, OnDestroy {

  @Input() questions!: any;
  @Input() loading!: boolean;
  searchPhrase = '';
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

  onFilterChange(type?: QuestionType): void {
    this.type = typeof type === 'string' ? type : this.type;
    this.questionService.filterQuestions({content: this.searchPhrase, type: this.type})
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

}
