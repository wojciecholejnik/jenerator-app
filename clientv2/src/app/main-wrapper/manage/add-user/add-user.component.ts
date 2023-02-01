import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  @Input() type!: 'add' | 'edit';
  @Input() userInput?: User;
  @Output() onModalClose: EventEmitter<any> = new EventEmitter();
  user = this.fb.group({
    isAdmin: [false, Validators.required],
    login: ['qwe', Validators.required],
    password: ['', Validators.required],
    displayName: ['', Validators.required],
    shortName: ['', Validators.required],
    emoticon: ['', Validators.required],
  });
  errorMessage = '';
  private addUser$?: Subscription;

  constructor(private manageService: ManageService, private fb: FormBuilder) { }

  ngOnInit(): void {
    
    if (this.type === 'edit' && this.userInput) {
      this.user.controls['isAdmin'].setValue(this.userInput.isAdmin);
      this.user.controls['login'].setValue(this.userInput.login);
      this.user.controls['displayName'].setValue(this.userInput.displayName);
      this.user.controls['shortName'].setValue(this.userInput.shortName);
      this.user.controls['emoticon'].setValue(this.userInput.emoticon);
    }

  }

  ngOnDestroy(): void {
    this.addUser$?.unsubscribe();
  }

  closeModal(): void {
    this.onModalClose.emit();
  }

  valueChange(): void {
    if (this.user.status == 'VALID') {
      this.errorMessage = ''
    }
  }

  addUser(): void {
    if (this.user.status == 'INVALID') {
      this.errorMessage = 'Nie wszystkie pola są wypełnione !';
      return
    }
    this.addUser$ = this.manageService.addUser(this.user.value).subscribe({
      next: (res) => {
        this.manageService.users.next(res);
        this.closeModal();
      },
      error: (e) => {
        // Handle error
      }
    })

  }
  

}
