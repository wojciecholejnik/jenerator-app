import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { Category, Question, QuestionFilter, QuestionsFilter, QuestionToSaveDTO, QuestionType } from '../shared/models';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService implements OnDestroy {

  categories$: BehaviorSubject<any> = new BehaviorSubject('');
  categoryFilterPhrase$: BehaviorSubject<string> = new BehaviorSubject('');
  selectedCategory$: BehaviorSubject<any> = new BehaviorSubject('');
  questions$: BehaviorSubject<any> = new BehaviorSubject('');
  selectedQuestion$: BehaviorSubject<any> = new BehaviorSubject('');
  questionFilter$: BehaviorSubject<QuestionsFilter> = new BehaviorSubject({
    content: '',
      author: '',
      type: '',
      status: '',
  } as QuestionsFilter)
  allCategories?: Category[];
  allQuestions?: Question[];

  private getCategories$?: Subscription;
  private deleteCategory$?: Subscription;
  private editCategory$?: Subscription;
  private getQuestions$?: Subscription;

  constructor(private apiService: ApiService) { }

  ngOnDestroy(): void {
    this.getCategories$?.unsubscribe();
    this.deleteCategory$?.unsubscribe();
    this.editCategory$?.unsubscribe();
    this.questions$?.unsubscribe();
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

  getQuestionsByCategory(categoryId: string): void {
    this.apiService.getQuestionsByCategory(categoryId).subscribe({
      next: (res) => {
        this.questions$.next(res);
        this.allQuestions = res;
      },
      error: () => {
        this.questions$.next('')
      }
    })
  }

  filterQuestions(filter: QuestionsFilter): void {
    const filterQuestionStatus = (questionStatus: boolean, filterStatus: 'active' | 'blocked' | ''): boolean => {
      if (filterStatus === 'active') {
        return !questionStatus
      } else if (filterStatus === 'blocked') {
        return questionStatus
      } else {
        return true
      }
    }
    this.questionFilter$.next(filter);
    const filteredQuestions = this.allQuestions?.filter(
      question => question.questionContent.toLocaleLowerCase().includes(this.questionFilter$.value.content.toLocaleLowerCase()) 
      && question.type.toLocaleLowerCase().includes(this.questionFilter$.value.type.toLocaleLowerCase())
      && question.author.shortName.toLowerCase().includes(filter.author.toLowerCase())
      && filterQuestionStatus(question.blocked, filter.status)
    )
    this.questions$.next(filteredQuestions);
  }

  addQuestion(question: QuestionToSaveDTO): Observable<Question[]> {
    return this.apiService.addQuestion(question)
  }

  deleteQuestion(questionId: string, categoryId: string): Observable<Question[]> {
    return this.apiService.deleteQuestion(questionId, categoryId)
  }

  editQuestion(question: QuestionToSaveDTO): Observable<Question[]> {
    return this.apiService.editQuestion(question)
  }

  getAllCategories(): Category[] {
    return this.allCategories || []
  }

  getSelectedCategory(): Category {
    return this.selectedCategory$.getValue()
  }

  getAllQuestionsForTest(categoryId: string) {
    return this.apiService.getQuestionsByCategory(categoryId)
  }

}
