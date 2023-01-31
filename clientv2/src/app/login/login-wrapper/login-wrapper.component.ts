import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrls: ['./login-wrapper.component.scss']
})
export class LoginWrapperComponent implements OnInit, OnDestroy {

  private userData$?: Subscription;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    const loggedUserId = this.loginService.loadLocal();
    if (loggedUserId) {
      this.userData$ = this.loginService.getUserData(loggedUserId).subscribe({
        next: (data) => this.loginService.handleLogin(data)
      })
    }
  }

  ngOnDestroy(): void {
    this.userData$?.unsubscribe();
  }

}
