import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from "@angular/router"
import { ToastService } from '../toast/toast.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  emailInput?: string;
  passwordInput?: string;
  showModal = false;
  text = '';
  type = '';
  requestPending = false;
  requestError = '';

  constructor(private userService: UserService,
              private router: Router,
              private toastService: ToastService) { }

  ngOnInit(): void {
    const email = sessionStorage.getItem('email');
    const displayName = sessionStorage.getItem('displayName');
    const shortName = sessionStorage.getItem('shortName');
    const emoticon = sessionStorage.getItem('emoticon');
    const isAdmin = sessionStorage.getItem('isAdmin');
    const userId = sessionStorage.getItem('userId');
    const isUserLogged = email && displayName;

    if(isUserLogged && emoticon && email && displayName && shortName && userId) {
      this.userService.displayName = displayName;
      this.userService.email = email;
      this.userService.shortName = shortName;
      this.userService.emoticon = emoticon;
      this.userService.userId = userId;
      isAdmin ? this.userService.isAdmin = true : this.userService.isAdmin = false;
      this.router.navigate(['/main']);
    }
  }

  login() {
    if(this.emailInput && this.passwordInput) {
      this.requestPending = true;
      this.userService.login(this.emailInput, this.passwordInput).subscribe(
        (res) => {
          const user = res;
          if(user && user.displayName && user.email) {
            this.userService.displayName = user.displayName;
            this.userService.email = user.email;
            this.userService.shortName = user.shortName;
            this.userService.isAdmin = user.isAdmin;
            this.userService.emoticon = user.emoticon;
            sessionStorage.setItem('userId', user._id);
            sessionStorage.setItem('email', user.email);
            sessionStorage.setItem('displayName', user.displayName);
            sessionStorage.setItem('shortName', user.shortName);
            sessionStorage.setItem('isAdmin', user.isAdmin ? 'true' : 'false');
            sessionStorage.setItem('emoticon', user.emoticon);
            localStorage.setItem('background', user.background);
            document.body.style.background = user.background;
            this.router.navigate(['/main']);
            this.requestPending = false;
          }
        },
        (e: any) => {
          if (e.status === 0) {
            this.requestPending = false;
            this.requestError = 'brak połączenia z serwerem :(';
            this.showModal = true;
          } else if (e.status === 404 && e.error.message === 'invalid data') {
            this.requestPending = false;
            this.text = 'błędna nazwa użytkownika lub hasło';
            this.requestError = 'błędna nazwa użytkownika bądź hasło'
          }
        }
      )
    } else {
      this.requestError = 'najpierw podaj wszystkie dane !';
    }
  }

}
