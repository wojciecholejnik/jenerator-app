import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Category, User } from './models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  private apiHost!: string;

  constructor(private http: HttpClient) {
    this.apiHost = environment.baseApiUrl;
  }

  login(login: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiHost}/users/login`, {email: login, password: password}, this.httpOptions)
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(`${this.apiHost}/get-categories`, this.httpOptions) 
  }

  addCategory(name: string): Observable<Category[]> {
    return this.http.post<any>(`${this.apiHost}/add-category`, {name: name}, this.httpOptions) 
  }

  editCategory(id: string, newName: string): Observable<Category[]> {
    return this.http.post<any>(`${this.apiHost}/edit-category`, {_id: id, newName: newName}, this.httpOptions) 
  }

  deleteCategory(id: string): Observable<Category[]> {
    return this.http.post<any>(`${this.apiHost}/delete-category`, {_id: id}, this.httpOptions)  
  }
}
