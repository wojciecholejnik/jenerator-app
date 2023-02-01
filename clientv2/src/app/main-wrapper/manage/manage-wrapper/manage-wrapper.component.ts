import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models';
import { ManageService } from '../manage.service';

@Component({
  selector: 'app-manage-wrapper',
  templateUrl: './manage-wrapper.component.html',
  styleUrls: ['./manage-wrapper.component.scss']
})
export class ManageWrapperComponent implements OnInit, OnDestroy {

  addModalIsOpen = false;
  editModalIsOpen = false;
  users$?: Subscription;
  users: User[] = [];

  constructor(private manageService: ManageService) { }

  ngOnInit(): void {
    this.users$ = this.manageService.users.subscribe(users => this.users = users);
    this.manageService.getUsers();
  }

  ngOnDestroy(): void {
    this.users$?.unsubscribe();
  }

  toggleOpenAddUser(): void {
    this.addModalIsOpen = !this.addModalIsOpen;
  }

}
