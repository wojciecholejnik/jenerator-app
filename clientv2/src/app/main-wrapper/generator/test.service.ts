import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { NewTest, Test } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class TestService implements OnDestroy {

  constructor(private apiService: ApiService) { }

  private getTests$?: Subscription;
  allTests$: BehaviorSubject<any> = new BehaviorSubject('');
  tests$: BehaviorSubject<any> = new BehaviorSubject('');
  testsFilter = {
    category: '',
    name: '',
    creation: '',
    author: ''
  }
  testsFilterPhrases$: BehaviorSubject<any> = new BehaviorSubject(this.testsFilter);


  ngOnDestroy(): void {
    this.getTests$?.unsubscribe();
  }

  getTests(): void {
    this.getTests$ = this.apiService.getAllTest().subscribe(res => {
      this.allTests$.next(res);
      this.filterTests();
    })
  }

  saveTest(test: NewTest): Observable<NewTest[]> {
    return this.apiService.addTest(test)
  }

  deleteTest(testId: string): Observable<NewTest[]> {
    return this.apiService.deleteTest(testId)
  }

  filterTests(): void {
    const filteredTests = this.allTests$.getValue().filter((test: Test) => {
      return test.category.name.toLowerCase().includes(this.testsFilterPhrases$.getValue().category.toLowerCase())
      && test.name.toLowerCase().includes(this.testsFilterPhrases$.getValue().name.toLowerCase())
      && (new Date(test.date).toLocaleDateString() + ', ' + new Date(test.date).toLocaleTimeString()).includes(this.testsFilterPhrases$.getValue().creation)
      && test.author.shortName.toLowerCase().includes(this.testsFilterPhrases$.getValue().author.toLowerCase())
    })
    this.tests$.next(filteredTests)
  }
  
}
