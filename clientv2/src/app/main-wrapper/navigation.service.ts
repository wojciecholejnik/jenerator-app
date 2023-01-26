import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavName, NavOption } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  navOptions: NavOption[] = [
    {
      name: 'categories',
      active: false
    },
    {
      name: 'questions',
      active: true
    },
    {
      name: 'add-question',
      active: false
    },
    {
      name: 'generator',
      active: false
    }
  ]

  navOptions$: BehaviorSubject<NavOption[]> = new BehaviorSubject(this.navOptions);

  constructor() { }

  setNavOption(name: NavName) {
    this.navOptions = this.navOptions.map(option => {
      if (option.name === name) {
        return {
          ...option,
          active: true
        }
      } else {
        return {
          ...option,
          active: false
        }
      }
    })
    this.navOptions$.next(this.navOptions);
  }
}
