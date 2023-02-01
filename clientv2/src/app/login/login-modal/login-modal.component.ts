import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  loginForm!: FormGroup;
  loading= false;
  user?: User;
  user$?: Subscription;
  errorMessage = '';

  constructor(private fb: FormBuilder, private loginService: LoginService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    })
    this.user$ = this.loginService.loggedUser.subscribe(res => {
      if (res === '') {
        return
      }

      if (res && res._id) {
        this.user = res
      } else if (res && res.error && res.status === 404) {
        this.errorMessage = 'Podane dane są niewłaściwe !'
        this.loading = false;
      } else {
        this.loading = false;
        this.errorMessage = 'Coś poszło nie tak. Spróbuj ponownie.'
      }
    });
  }

  inputChange(): void {
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginService.login(this.loginForm.controls.login.value, this.loginForm.controls.password.value);
    }
  }

}