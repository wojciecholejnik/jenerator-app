import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Question } from 'src/app/shared/models';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss']
})
export class DeleteConfirmationComponent implements OnInit, OnDestroy {
  @Output() onModalClose: EventEmitter<any> = new EventEmitter();
  @Input() question!: Question;
  private delete$?: Subscription;

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.delete$?.unsubscribe();
  }

  closeModal(): void {
    this.onModalClose.emit();
  }

  deleteCategory(): void {
    if (this.question._id && this.question.category) {
      this.delete$ = this.questionService.deleteQuestion(this.question._id, this.question.category._id).subscribe({
        next: (res) => {
          this.questionService.allQuestions = res;
          this.questionService.filterQuestions(this.questionService.questionFilter$.value);
          this.closeModal();
        },
        error: (e) => {
          //TODO: hadle error
        }
      })
    }
  }

}
