import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from 'src/app/login/login.service';
import { User } from 'src/app/shared/models';
import { GeneratorService } from '../generator/generator.service';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
  styleUrls: ['./top-menu.component.scss']
})
export class TopMenuComponent implements OnInit, OnDestroy {

  private _user?: Subscription;
  user!: User;

  editModalIsOpen = false;

  constructor(private loginService: LoginService, private generatorService: GeneratorService) { }

  ngOnInit(): void {
    this._user = this.loginService.loggedUser.subscribe(user => {
      this.user = user;
    })
  }

  ngOnDestroy(): void {
    this._user?.unsubscribe();
  }

  logout() {
    this.loginService.logout();
    this.generatorService.abortNewTest();
  }

  toggleEditModal() {
    this.editModalIsOpen = !this.editModalIsOpen;
  }

}
