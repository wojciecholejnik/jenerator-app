import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { User, UserFields } from 'src/app/shared/models';
import { GeneratorService } from '../../generator/generator.service';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit, OnDestroy {

  @Input() type!: 'add' | 'edit';
  @Input() userInput?: User;
  @Input() selfEdit?: boolean;
  @Output() onModalClose: EventEmitter<any> = new EventEmitter();
  user = this.fb.group({
    isAdmin: [false, Validators.required],
    login: ['', Validators.required],
    password: [''],
    displayName: ['', Validators.required],
    shortName: ['', Validators.required],
    emoticon: ['', Validators.required],
  });
  errorMessage = '';
  private addUser$?: Subscription;

  constructor(
    private manageService: ManageService,
    private fb: FormBuilder,
    private loginService: LoginService,
    private generatorService: GeneratorService
  ) { }

  ngOnInit(): void {
    
    if (this.type === 'edit' && this.userInput) {
      this.user.controls['isAdmin'].setValue(this.userInput.isAdmin);
      this.user.controls['login'].setValue(this.userInput.login);
      this.user.controls['displayName'].setValue(this.userInput.displayName);
      this.user.controls['shortName'].setValue(this.userInput.shortName);
      this.user.controls['emoticon'].setValue(this.userInput.emoticon);
    } else {
      this.user.controls['password'].addValidators(Validators.required)
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

  editUser(): void {
    if (this.user.status == 'INVALID') {
      this.errorMessage = 'Nie wszystkie pola są wypełnione !';
      return
    }
    let userFiledsDTO: UserFields = {
      _id: this.userInput && this.userInput._id ? this.userInput._id : '',
    }

    if (this.user.controls['login'].touched) {
      userFiledsDTO = {
        ...userFiledsDTO,
        login: this.user.controls['login'].value 
      }
    }
    if (this.user.controls['password'].touched) {
      userFiledsDTO = {
        ...userFiledsDTO,
        password: this.user.controls['password'].value 
      }
    }
    if (this.user.controls['displayName'].touched) {
      userFiledsDTO = {
        ...userFiledsDTO,
        displayName: this.user.controls['displayName'].value 
      }
    }
    if (this.user.controls['isAdmin'].touched) {
      userFiledsDTO = {
        ...userFiledsDTO,
        isAdmin: this.user.controls['isAdmin'].value 
      }
    }
    if (this.user.controls['emoticon'].touched) {
      userFiledsDTO = {
        ...userFiledsDTO,
        emoticon: this.user.controls['emoticon'].value 
      }
    }

    this.addUser$ = this.manageService.editUser(userFiledsDTO).subscribe({
      next: (res) => {
        this.manageService.users.next(res);
        this.closeModal();
        if (this.selfEdit) {
          this.loginService.logout();
        }
      },
      error: (e) => {
        if (e.status === 409) {
          this.errorMessage = e.error.message
        }
      }
    })

  }
  

}
