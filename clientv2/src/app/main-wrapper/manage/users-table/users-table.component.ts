import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  @Input() users: User[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
