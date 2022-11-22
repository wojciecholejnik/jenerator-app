import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from "@angular/router"
import { User } from './shared/interafaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  API_URL = '';
  user?: User;
  userId = '';
  displayName = '';
  email = '';
  shortName = '';
  isAdmin = false;
  emoticon = '';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  
  constructor(private http: HttpClient, private router: Router) {
    this.API_URL = environment.baseApiUrl;
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users/login`, {email: email, password: password}, this.httpOptions)
  }

  changePassword(data: {userId: string, newPassword: string}): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/users/changePassword`, data, this.httpOptions );
  }

  changeName(data: {userId: string, newName: string}): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/users/changeName`, data, this.httpOptions );
  }

  changeLogin(data: {userId: string, newLogin: string}): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/users/changeLogin`, data, this.httpOptions );
  }

  changeEmoticon(data: {userId: string, newEmoticon: string}): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/users/changeEmoticon`, data, this.httpOptions );
  }

  changeBackground(data: {userId: string, newBackground: string}): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/users/changeBackground`, data, this.httpOptions );
  }

  logOut(){
    this.user = undefined;
    this.displayName = '';
    this.email = '';
    this.isAdmin = false;
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
