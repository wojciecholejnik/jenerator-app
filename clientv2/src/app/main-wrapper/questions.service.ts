import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { Category } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService implements OnDestroy {

  allCategories?: Category[];
  categories$: BehaviorSubject<any> = new BehaviorSubject('');
  categoryFilterPhrase$: BehaviorSubject<string> = new BehaviorSubject('');
  private getCategories$?: Subscription;
  private deleteCategory$?: Subscription;
  private editCategory$?: Subscription;

  constructor(private apiService: ApiService) { }

  ngOnDestroy(): void {
    this.getCategories$?.unsubscribe();
    this.deleteCategory$?.unsubscribe();
    this.editCategory$?.unsubscribe();
  }

  getCategories() {
    this.apiService.getCategories().subscribe({
      next: (res) => {
        this.categories$.next(res);
        this.allCategories = res;
      },
      error: () => {
        this.categories$.next('')
      }
    })
  }

  filerCategories(phrase: string): void {
    const filteredCategories = this.allCategories?.filter(category => category.name.toLowerCase().includes(phrase.toLowerCase()))
    this.categories$.next(filteredCategories);
    this.categoryFilterPhrase$.next(phrase);
  }

  deleteCategory(id: string): Observable<Category[]> {
    return this.apiService.deleteCategory(id)
  }

  editCategory(id: string, newName: string): Observable<Category[]> {
    return this.apiService.editCategory(id, newName)
  }

  addCategory(name: string): Observable<Category[]> {
    return this.apiService.addCategory(name)
  }


}
