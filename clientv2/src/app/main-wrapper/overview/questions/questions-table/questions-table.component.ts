import { Component, Input, OnInit } from '@angular/core';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Question, QuestionType } from 'src/app/shared/models';

@Component({
  selector: 'app-questions-table',
  templateUrl: './questions-table.component.html',
  styleUrls: ['./questions-table.component.scss']
})
export class QuestionsTableComponent implements OnInit {

  @Input() questions!: any;
  @Input() loading!: boolean;
  searchPhrase = '';
  type: QuestionType | string = '';
  deletModalIsOpen = false;
  selectedQuestion?: Question;
  editModalIsOpen = false;
  previewModalIsOpen = false;

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
  }

  onFilterChange(type?: QuestionType): void {
    this.type = type || this.type;
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

}
