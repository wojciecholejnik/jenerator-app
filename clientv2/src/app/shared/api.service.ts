import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Category, NewTest, Question, QuestionToSaveDTO, Test, User, UserFields } from './models';

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
    return this.http.post<User>(`${this.apiHost}/users/login`, {login: login, password: password}, this.httpOptions)
  }

  getUserData(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiHost}/user/${userId}`, this.httpOptions)
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

  getQuestionsByCategory(categoryId: string): Observable<Question[]> {
    return this.http.get<any>(`${this.apiHost}/get-questions-category/${categoryId}`, this.httpOptions)  
  }

  addQuestion(question: QuestionToSaveDTO): Observable<any[]> {
    return this.http.post<any>(`${this.apiHost}/add-question/${question.category}`, question, this.httpOptions)  
  }

  deleteQuestion(questionId: string, categoryId: string): Observable<Question[]> {
    return this.http.delete<any>(`${this.apiHost}/delete-question/${questionId}/${categoryId}`, this.httpOptions) 
  }

  editQuestion(question: QuestionToSaveDTO): Observable<any[]> {
    return this.http.post<any>(`${this.apiHost}/edit-question/${question.category}`, question, this.httpOptions)  
  }

  getAllTest(): Observable<Test[]> {
    return this.http.get<any>(`${this.apiHost}/get-tests`, this.httpOptions)  
  }

  addTest(test: NewTest): Observable<Test[]> {
    return this.http.post<any>(`${this.apiHost}/add-test`, test, this.httpOptions)  
  }

  deleteTest(testId: string): Observable<Test[]> {
    return this.http.delete<any>(`${this.apiHost}/delete-test/${testId}`, this.httpOptions) 
  }

  getUserForManage(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiHost}/user-for-manage`, this.httpOptions)
  }

  addNewUser(user: User): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiHost}/add-user`, user, this.httpOptions)
  }

  editUser(user: UserFields): Observable<User[]> {
    return this.http.post<User[]>(`${this.apiHost}/edit-user`, user, this.httpOptions)
  }

  deleteUser(userId: string): Observable<User[]> {
    return this.http.delete<User[]>(`${this.apiHost}/delete-user/${userId}`, this.httpOptions)
  }
}
