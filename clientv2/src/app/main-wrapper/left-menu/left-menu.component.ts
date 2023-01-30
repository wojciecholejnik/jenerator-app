import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavName, NavOption } from 'src/app/shared/models';
import { GeneratorService } from '../generator/generator.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  navigation$?: Subscription;
  navigation!: NavOption[];
  newTest$?: Subscription;
  isNewTest = false;

  constructor(private navigationService: NavigationService, private generatorService: GeneratorService) { }

  ngOnInit(): void {
    this.navigation$ = this.navigationService.navOptions$.subscribe(data => this.navigation = data);
    this.newTest$ = this.generatorService.newTest$.subscribe((test: any) => this.isNewTest = test ? true : false)
  }

  ngOnDestroy(): void {
    this.navigation$?.unsubscribe();
    this.newTest$?.unsubscribe();
  }

  translateNavNames(name: NavName): string {
    if (name === 'categories') {
      return 'Kategorie'
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
