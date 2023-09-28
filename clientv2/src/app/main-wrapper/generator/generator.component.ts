import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, NewTest, Test } from 'src/app/shared/models';
import { QuestionsService } from '../questions.service';
import { GeneratorService } from './generator.service';
import { PrintService } from './print.service';
import { TestService } from './test.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, OnDestroy {

  private _newTest?: Subscription;
  private _selectedCategory?: Subscription
  private _saveTest?: Subscription;
  private _tests?: Subscription;
  private _generatePending?: Subscription;
  private _categories?: Subscription;

  isNewTest = false;
  newTest?: NewTest;
  allCategories: Category[] = [];
  selectedCategory?: Category;
  tests: Test[] = [];
  generatePending = false;

  constructor(
    private generatorService: GeneratorService,
    private questionService: QuestionsService,
    private testService: TestService,
    private printService: PrintService) { }

  ngOnInit(): void {
    this._tests = this.testService.tests$.subscribe(tests => this.tests = tests);
    this._newTest = this.generatorService.newTest$.subscribe((test: any) => {
      if (test) {
        this.newTest = test;
        this.isNewTest = true;
      } else {
        this.newTest = undefined;
        this.isNewTest = false;
      }
    });
    this._categories = this.questionService.categories$.subscribe(categories => this.allCategories = categories);
    this._selectedCategory = this.questionService.selectedCategory$.subscribe(category => {
      if (this.isNewTest) {
        this.selectedCategory = category;
        this.generatorService.newTest$.next({...this.generatorService.newTest$.getValue(), category: category});
      }
    })
    this._generatePending = this.generatorService.generatePending$.subscribe(state => this.generatePending = state);
    
    this.testService.getTests()
    this.questionService.getCategories();
  }

  ngOnDestroy(): void {
    this._newTest?.unsubscribe();
    this._saveTest?.unsubscribe();
    this._tests?.unsubscribe();
    this._selectedCategory?.unsubscribe();
    this._categories?.unsubscribe();
    this._generatePending?.unsubscribe();
  }

  startNewTest(): void {
    this.questionService.selectedCategory$.next('');
    this.generatorService.startNewTest();
  }

  abortNewTest(): void {
    this.questionService.selectedCategory$.next('');
    this.generatorService.startNewTest();
    this.generatorService.abortNewTest();
  }

  restetQuestions() {
    this.generatorService.newTest$.next({...this.newTest, questions: []})
  }

  selectCategory(category: Category): void {
    this.selectedCategory = category;
    this.questionService.selectedCategory$.next(category);
  }

  getRandom() {
    this.generatorService.getRandomQuestions();
  }

  printUnresolvedTest(): void {
    if (this.newTest) {
      this.printService.printUnresolvedTest(this.newTest)
    }
  }

  printResolvedTest(): void {
    if (this.newTest) {
      this.printService.printResolvedTest(this.newTest)
    }
  }

  saveTest(): void {
    if (!this.newTest) return
    this._saveTest = this.testService.saveTest(this.newTest).subscribe(res => {
      if (res) {
        this.testService.allTests$.next(res);
        this.testService.filterTests();
        this.generatorService.newTest$.next('');
      }
    })
  }

  isTestValid(): boolean {
    if (!this.newTest) return false;
    if (this.newTest.author && this.newTest.category && this.newTest.questions.length === 6) {
      return true
    }  else {
      return false
    }
  }
}
 
