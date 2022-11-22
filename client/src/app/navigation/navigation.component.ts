import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import {Router} from "@angular/router"
import { DataService } from '../data-service.service';

@Component({
  selector: 'app-naviation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  active = naviation.addOopen;
  emoticon = sessionStorage.getItem('emoticon');

  constructor(public userService: UserService, private dataService: DataService, private router: Router) {}

  ngOnInit(): void {}

}

enum naviation {
  preview = 1,
  addSingleSelect = 2,
  addMultiSelect = 3,
  addOopen = 4,
  generate = 5,
  account = 6,
  logOut = 7
}
