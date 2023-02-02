import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { LoginService } from 'src/app/login/login.service';
import { NavOption } from 'src/app/shared/models';
import { GeneratorService } from '../generator/generator.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  styleUrls: ['./main-wrapper.component.scss']
})
export class MainWrapperComponent implements OnInit, OnDestroy {

  navigation$?: Subscription;
  navigation!: NavOption[];

  constructor(
    private navigationService: NavigationService,
    private loginService: LoginService,
    private generatorService: GeneratorService
  ) { }

  ngOnInit(): void {
    this.navigation$ = this.navigationService.navOptions$.subscribe(data => this.navigation = data);
  }

  ngOnDestroy(): void {
    this.navigation$?.unsubscribe();
    this.generatorService.abortNewTest();
  }

  shoulBeVisible(name: string): boolean {
    const index = this.navigation.findIndex(item => item.name === name);
    if (name === 'manage' && !this.loginService.loggedUser.getValue().isAdmin) {
      return false
    } else {
      return this.navigation[index].active
    }
  }

}
