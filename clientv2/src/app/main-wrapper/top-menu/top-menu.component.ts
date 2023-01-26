import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from 'src/app/login/login.service';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit, OnDestroy {

  user$?: Subscription;
  user!: User;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
    this.user$ = this.loginService.loggedUser.subscribe(user => {
      this.user = user;
    })
  }

  ngOnDestroy(): void {
    
  }

  logout() {
    this.loginService.logout();
  }

}
