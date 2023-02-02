import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  @Input() users: User[] = [];
  selectedUser?: User;
  deleteConfirmatnionIsOpen = false;
  editModalIsOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleDeleteConfirmatnion(user?: User): void {
    if (user) {
      this.selectedUser = user;
      this.deleteConfirmatnionIsOpen = true;
    } else {
      this.selectedUser = undefined;
      this.deleteConfirmatnionIsOpen = false;
    }
  }

  toggleEditModal(user?: User): void {
    if (user) {
      this.selectedUser = user;
      this.editModalIsOpen = true;
    } else {
      this.selectedUser = undefined;
      this.editModalIsOpen = false;
    }
  }

}
