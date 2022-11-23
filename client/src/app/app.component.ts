import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from './shared/interafaces';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  _user?: Subscription;
  user?: User;

  constructor (private userService: UserService){};

  ngOnInit(): void {
    this._user = this.userService.user.subscribe((user) => {
      this.user = user;
    })
      const background = localStorage.getItem('background');
      if (background) {
        document.body.style.background = background;
      }
  }
}
