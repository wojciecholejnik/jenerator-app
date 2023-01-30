import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  login$?: Subscription;
  loggedUser: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnDestroy(): void {
    this.login$?.unsubscribe();
  }

  login(login: string, password: string) {
    this.login$ = this.apiService.login(login, password).subscribe({
      next: (res) => {
        this.loggedUser.next(res);
        this.router.navigate(['app'])
      },
      error: (e) => {
        this.loggedUser.next(e)
      }
    })
  }

  isUserLogged(): boolean {
    return this.loggedUser.value
  }

  logout() {
    this.loggedUser.next('');
    this.router.navigate([''])
  }

  getAuthor() {
    return {
      _id: this.loggedUser.value._id,
      shortName: this.loggedUser.value.shortName,
      emoticon: this.loggedUser.value.emoticon
    }
  }


}
