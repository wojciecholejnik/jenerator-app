import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { NewTest } from 'src/app/shared/models';

@Injectable({
  providedIn: 'root'
})
export class TestService implements OnDestroy {

  constructor(private apiService: ApiService) { }

  private getTests$?: Subscription;
  allTests$: BehaviorSubject<any> = new BehaviorSubject('');
  tests$: BehaviorSubject<any> = new BehaviorSubject('');

  ngOnDestroy(): void {
    this.getTests$?.unsubscribe();
  }

  getTest(): void {
    this.getTests$ = this.apiService.getAllTest().subscribe(res => {
      this.allTests$.next(res)
    })
  }

  saveTest(test: NewTest): Observable<NewTest[]> {
    return this.apiService.addTest(test)
  }

  deleteTest(testId: string): Observable<NewTest[]> {
    return this.apiService.deleteTest(testId)
  }
  
}
