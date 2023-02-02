import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-delete-user-confirmation',
  templateUrl: './delete-user-confirmation.component.html',
  styleUrls: ['./delete-user-confirmation.component.scss']
})
export class DeleteUserConfirmationComponent implements OnInit, OnDestroy {

  @Input() user!: User;
  @Output() onModalClose: EventEmitter<any> = new EventEmitter();
  errorMessage = '';

  private delete$?: Subscription;

  constructor(private manageService: ManageService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.delete$?.unsubscribe()
  }

  closeModal(): void {
    this.onModalClose.emit();
  }

  deleteUser(): void {
    if (!this.user._id) return
    this.delete$ = this.manageService.deleteUser(this.user._id).subscribe({
      next: (res) => {
        this.manageService.users.next(res);
        this.closeModal()
      },
      error: (e) => {
        //TODO: Handle error
      }
    })
  }

}
