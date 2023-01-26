import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { ApiService } from 'src/app/shared/api.service';
import { NavOption } from 'src/app/shared/models';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-main-wrapper',
  templateUrl: './main-wrapper.component.html',
  styleUrls: ['./main-wrapper.component.scss']
})
export class MainWrapperComponent implements OnInit, OnDestroy {

  navigation$?: Subscription;
  navigation!: NavOption[];

  constructor(private apisService: ApiService, private navigationService: NavigationService) { }

  ngOnInit(): void {
    this.navigation$ = this.navigationService.navOptions$.subscribe(data => this.navigation = data);
  }

  ngOnDestroy(): void {
    this.navigation$?.unsubscribe();
  }

  // addCategory(name: string): void {
  //   this.apisService.addCategory(name).subscribe()
  // }

  shoulBeVisible(name: string): boolean {
    const index = this.navigation.findIndex(item => item.name === name);
    return this.navigation[index].active
  }

}
