import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavName, NavOption } from 'src/app/shared/models';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  navigation$?: Subscription;
  navigation!: NavOption[];

  constructor(private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigation$ = this.navigationService.navOptions$.subscribe(data => this.navigation = data);
  }

  ngOnDestroy(): void {
    this.navigation$?.unsubscribe();
  }

  translateNavNames(name: NavName): string {
    if (name === 'categories') {
      return 'Kategorie'
    } else if (name === 'add-question') {
      return 'Dodaj pytanie'
    } else if (name === 'questions') {
      return 'Pytania'
    } else if (name === 'generator') {
      return 'Generator'
    } else {
      return ''
    }
  }

  changeNavOption(name: NavName): void {
    this.navigationService.setNavOption(name);
  }

}
