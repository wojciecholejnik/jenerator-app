import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/shared/models';
import { TestService } from '../test.service';

@Component({
  selector: 'app-delete-test-confirmation',
  templateUrl: './delete-test-confirmation.component.html',
  styleUrls: ['./delete-test-confirmation.component.scss']
})
export class DeleteTestConfirmationComponent implements OnInit, OnDestroy {

  @Input() test!: Test;
  @Output() onModalClose: EventEmitter<any> = new EventEmitter();
  private deleteTest$?: Subscription;

  errorMessage = '';

  constructor(private testService: TestService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.deleteTest$?.unsubscribe();
  }

  closeModal(): void {
    this.onModalClose.emit();
  }

  deleteTest(): void {
    this.deleteTest$ = this.testService.deleteTest(this.test._id).subscribe({
      next: (res) => {
        //TODO: change after filtering
        this.testService.allTests$.next(res);
        this.testService.tests$.next(res);
        this.closeModal();
      },
      error: (e) => {
        this.errorMessage = e.error.message;
      }
    })
  }

}
