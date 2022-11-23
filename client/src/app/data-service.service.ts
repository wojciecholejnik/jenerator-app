import { HttpClient, HttpHeaders, HttpParamsOptions,   } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category, Question, Test, TestToSave } from './shared/interafaces';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_URL = '';
  data: BehaviorSubject<any> = new BehaviorSubject([]);
  categories: string[] = [];
  categories2: Category[] = [];
  subjectedCategories: Subject<any> = new Subject<any>();
  private subjectedData: Subject<any> = new Subject<any>();
  private subjectedData2: Subject<any> = new Subject<any>();
  randomQuestions = {singleSelect: [], multiSelect: [], open: [] };
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=utf-8' }),
  };
  constructor(private http: HttpClient) {
    this.API_URL = environment.baseApiUrl;
  }

  sendData(data: any) {
    this.subjectedData.next(data);
  }

  sendData2(data: any) {
    this.subjectedData2.next(data);
  }

  subscribeData(): Observable<any> {
    return this.subjectedData.asObservable();
  }

  subscribeData2(): Observable<any> {
    return this.subjectedData2.asObservable();
  }

  getData() {
    this.http.get<Question[]>(`${this.API_URL}/questions`).subscribe({
      next: (questions) => {
        this.data.next(questions);
        this.getCategories();
      },
      error: () => {
        console.warn('błąd pobierania danych z serwera')
      }
    })
  }

  getRandom(category: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/randomQuestions`, {category: category}, this.httpOptions)
  }

  addFile(formData: any, options: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/save-file`, formData, options)
  }

  addQuestion(questionContent: any,): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/questions`, questionContent);
  }
/// deprecated
  postData(formData: any, options?: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/questions`, formData, options)
  }


  updateData(question: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/questions/${question._id}`, question, this.httpOptions );
  }

  getCategories() {
    this.categories2 = [];
    this.categories = [];
    this.data.value.map((category: { category: any; }) => {
      const testCategory = this.categories.find(cat => cat === category.category);
      if (!testCategory) {
        this.categories.push(category.category);
        this.categories2.push({
          _id: this.categories2.length + 1,
          name: category.category, 
          amount: 0,
          singleAmount: 0,
          multiAmount: 0,
          openAmount: 0,
        });
      }
    });

    this.data.value.forEach((question: any) => {
      const category = this.categories2.find(category => category.name === question.category);
      if (category && question.type === 'singleSelect') {
        category.amount +=1;
        category.singleAmount +=1;
      } 
      if (category && question.type === 'multiSelect') {
        category.amount +=1;
        category.multiAmount +=1;
      }
      if (category && question.type === 'open') {
        category.amount +=1;
        category.openAmount +=1;
      }
    });

    this.subjectedCategories.next(this.categories2);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete<any>(`${this.API_URL}/questions/${id}`);
  }

  downloadPdf(questions: any){
    return this.http.post(`${this.API_URL}/questionGenerate`, questions, {... this.httpOptions, responseType: 'blob'});
  }

  downloadResolvedPdf(questions: any){
    return this.http.post(`${this.API_URL}/questionGenerateResolved`, questions, {... this.httpOptions, responseType: 'blob'});
  }

  getTests(): Observable<any>{
    return this.http.get<any>(`${this.API_URL}/tests`, this.httpOptions);
  }

  saveTest(data: TestToSave): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/tests/save`, data, this.httpOptions);
  }

  deleteTest(data: Test): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/tests/delete`, data, this.httpOptions);
  }
}

