import { Injectable, NgModule, OnDestroy, OnInit } from '@angular/core';
import { CanLoad, Route, Router, RouterModule, Routes, UrlSegment } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { LoginModule } from './login/login.module';
import { LoginService } from './login/login.service';
import { MainWrapperModule } from './main-wrapper/main-wrapper.module';

@Injectable()
export class IsUserLogged implements CanLoad {

  user$?: Subscription;
  isLogged = false;

  constructor(private loginService: LoginService, private router: Router) {}

  canLoad(): Observable<boolean>|Promise<boolean>|boolean {
    if (this.loginService.isUserLogged()) {
      return true
    } else {
      this.router.navigate(['/'])
      return false
    }
  }
}

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(() => LoginModule),
  },
  {
    path: 'app',
    loadChildren: () => import('./login/login.module').then(() => MainWrapperModule),
    canLoad: [IsUserLogged]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
