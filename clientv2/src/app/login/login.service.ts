import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GeneratorService } from '../main-wrapper/generator/generator.service';
import { ApiService } from '../shared/api.service';
import { User } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  private login$?: Subscription;
  loggedUser: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnDestroy(): void {
    this.login$?.unsubscribe();
  }

  login(login: string, password: string) {
    this.login$ = this.apiService.login(login, password).subscribe({
      next: (res) => {
        this.handleLogin(res);
        this.saveToLocal();
      },
      error: (e) => {
        this.loggedUser.next(e)
      }
    })
  }

  handleLogin(res: User): void {
    this.loggedUser.next(res);
    this.router.navigate(['app']);
  }

  getUserData(userId: string): Observable<User> {
    return this.apiService.getUserData(userId)
  }

  isUserLogged() {
    return this.loggedUser.getValue()
  }

  logout() {
    this.loggedUser.next('');
    // this.generatorService.abortNewTest();
    this.router.navigate(['']);
    this.removeFromLlocal();
  }

  getAuthor() {
    return {
      _id: this.loggedUser.value._id,
      shortName: this.loggedUser.value.shortName,
      emoticon: this.loggedUser.value.emoticon
    }
  }

  saveToLocal(): void {
    if (this.loggedUser.getValue()._id) {
      localStorage.setItem('userId', this.loggedUser.getValue()._id)
    };
  }

  loadLocal(): string | null {
    return localStorage.getItem('userId');
  }

  removeFromLlocal(): void {
    localStorage.removeItem('userId')
  }


}
