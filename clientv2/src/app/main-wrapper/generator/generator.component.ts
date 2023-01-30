import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category, NewTest, Test } from 'src/app/shared/models';
import { QuestionsService } from '../questions.service';
import { GeneratorService } from './generator.service';
import { TestService } from './test.service';

@Component({
  selector: 'app-generator',
  templateUrl: './generator.component.html',
  styleUrls: ['./generator.component.scss']
})
export class GeneratorComponent implements OnInit, OnDestroy {

  newTest$?: Subscription;
  selectedCategory$?: Subscription
  saveTest$?: Subscription;
  tests$?: Subscription;

  isNewTest = false;
  newTest?: NewTest;
  categories$?: Subscription;
  allCategories: Category[] = [];
  selectedCategory?: Category;
  tests: Test[] = [];

  constructor(
    private generatorService: GeneratorService,
    private questionService: QuestionsService,
    private testService: TestService) { }

  ngOnInit(): void {
    this.tests$ = this.testService.tests$.subscribe(tests => this.tests = tests);
    this.newTest$ = this.generatorService.newTest$.subscribe((test: any) => {
      if (test) {
        this.newTest = test;
        this.isNewTest = true;
      } else {
        this.newTest = undefined;
        this.isNewTest = false;
      }
    });
    this.categories$ = this.questionService.categories$.subscribe(categories => this.allCategories = categories);
    this.selectedCategory$ = this.questionService.selectedCategory$.subscribe(category => {
      if (this.isNewTest) {
        this.selectedCategory = category;
        this.generatorService.newTest$.next({...this.generatorService.newTest$.getValue(), category: category});
      }
    })
    this.testService.getTests()
    this.questionService.getCategories();
  }

  ngOnDestroy(): void {
    this.newTest$?.unsubscribe();
    this.saveTest$?.unsubscribe();
    this.tests$?.unsubscribe();
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

  printTest(): void {

      var divContents = document.getElementById("print-selection")?.innerHTML;

      if (divContents) {
        const style = document.createElement('style');
        style.innerHTML = styleSheet;
        
        const html = document.createElement('div');
        html.innerHTML = `
        
        <!-- FIRST-PAGE -->
    <div class="container">
      <!-- HEADER -->
      <div class="header">
        <div class="student-info">
          <p class="date-placeholder">Data:</p>
          <p class="student-name-placehoder">Imię i Nazwisko:</p>
        </div>
        <div class="test-info">
          <h6 class="category-name">${this.selectedCategory?.name}</h6>
          <div class="composer-container">
            <img class="emoticon" src=${this.newTest?.author.emoticon}>
            <p class="composer-name">${this.newTest?.author.shortName}</p>
          </div>
        </div>
      </div>

      <!-- QUESTIONS -->

      <!-- QUESTION1 -->
      <div class="question first">
        <div class="left-container">
          <h6>1. ${this.newTest?.questions[0].questionContent} </h6>
          <div class="answersContainer">         
            <div class="answers">

              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[0].answers[0].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[0].answers[1].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[0].answers[2].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[0].answers[3].content}</div>
              </div>

            </div>
          </div>
        </div>
        ${!this.newTest?.questions[0].img ? '' : `
        <div class="right-container">
          <img src=${this.newTest?.questions[0].img}>
        </div>`}
      </div>

      <!-- QUESTION2 -->
      <div class="question">
        <div class="left-container">
          <h6>2. ${this.newTest?.questions[1].questionContent} </h6>
          <div class="answersContainer">         
            <div class="answers">
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[1].answers[0].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[1].answers[1].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[1].answers[2].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[1].answers[3].content}</div>
              </div>
            </div>
          </div>
        </div>
        ${!this.newTest?.questions[1].img ? '' : `
        <div class="right-container">
          <img src=${this.newTest?.questions[1].img}>
        </div>`}
      </div>

      <!-- QUESTION3 -->
      <div class="question">
        <div class="left-container">
          <h6>3. ${this.newTest?.questions[2].questionContent} </h6>
          <div class="answersContainer">         
            <div class="answers">
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[2].answers[0].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[2].answers[1].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[2].answers[2].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[2].answers[3].content}</div>
              </div>
            </div>
          </div>
        </div>
        ${!this.newTest?.questions[2].img ? '' : `
        <div class="right-container">
          <img src=${this.newTest?.questions[2].img}>
        </div>`}
      </div>
    </div>

    <!-- SECOND-PAGE -->
    <div class="container">

      <!-- QUESTION4 -->
      <div class="question first">
        <div class="left-container">
          <h6>4. ${this.newTest?.questions[3].questionContent} </h6>
          <div class="answersContainer">         
            <div class="answers">
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[3].answers[0].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[3].answers[1].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[3].answers[2].content}</div>
              </div>
              <div class="answer-container">
                <div class="checkbox"></div>
                <div class="checkbox-label">${this.newTest?.questions[3].answers[3].content}</div>
              </div>
            </div>
          </div>
        </div>
        ${!this.newTest?.questions[3].img ? '' : `
        <div class="right-container">
          <img src=${this.newTest?.questions[3].img}>
        </div>`}
      </div>

      <!-- QUESTION5 -->
      <div class="question open">
        <div class="left-container">
          <h6>5. ${this.newTest?.questions[4].questionContent} </h6>
          <div class="answersContainer">
          </div>
        </div>
        ${!this.newTest?.questions[4].img ? '' : `
        <div class="right-container">
          <img src=${this.newTest?.questions[4].img}>
        </div>`}
      </div>

      <!-- QUESTION6 -->
      <div class="question open">
        <div class="left-container">
          <h6>6. ${this.newTest?.questions[5].questionContent} </h6>
          <div class="answersContainer">
          </div>
        </div>
        ${!this.newTest?.questions[5].img ? '' : `
        <div class="right-container">
          <img src=${this.newTest?.questions[5].img}>
        </div>`}
      </div>
      
    </div>
        
        
        `;
        
        const a = window.open("", '_blank');
        if (a && a.document && a.document.querySelector('body')) {
          const b = a.document.querySelector('body');
          if (b) {
            b.innerHTML = html.innerHTML;
            b.appendChild(style)
          }
          a.print();
          a.close();
        }
      }
      
    }

  saveTest(): void {
    if (!this.newTest) return
    this.saveTest$ = this.testService.saveTest(this.newTest).subscribe(res => {
      if (res) {
        //TODO: change after filtering
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


  const styleSheet = `
  * {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
  }

  .container {
    min-height: calc(297mm * 0.85);
    max-height: calc(297mm * 0.85);
    padding: calc(4mm * 0.85);
  }

  .header {
    margin-bottom: calc(5mm * 0.85);
    border-bottom: 1px solid black;
    height: calc(20mm * 0.85);
  }

  header::after {
    content: "";
    clear: both;
    display: table;
  }

  .student-info {
    float: left;
  }

  .date-placeholder, .student-name-placehoder {
    font-size: calc(4mm * 0.85);
  }

  .date-placeholder {
    margin-bottom: calc(3mm * 0.85);
  }

  .test-info {
    float: right;
    text-align: end;
  }

  .category-name {
    font-size: calc(4mm * 0.85);
    margin: 0 0 calc(3mm * 0.85) 0;
  }

  .emoticon {
    width: calc(10mm * 0.85);
    margin-right: calc(2mm * 0.85);
  }

  .composer-container::after {
    content: "";
    clear: both;
    display: table;
  }

  .composer-name {
    float: right;
    font-size: calc(3mm * 0.85);
    margin-top: calc(3mm * 0.85);
  }

  .question {
    margin-bottom: calc(3mm * 0.85);
    padding-top: calc(1mm * 0.85);
    border-top: 1px solid gray;
    height: calc(85mm * 0.85);
  }

  .question.open {
    height: calc(100mm * 0.85);
  }

  .first {
    border: none;
  }

  .question::after {
    content: "";
    clear: both;
    display: table;
  }

  h6 {
    margin: calc(2mm * 0.85) 0;
    font-size: calc(4mm * 0.85);
  }

  .left-container {
    float: left;
  }

  .answer-container {
    position: relative;
    margin-top: calc(3px * 0.85);
  }

  div.checkbox {
    border: 1px solid black;
    border-radius: 2px;
    width: calc(3mm * 0.85);
    min-height: calc(3mm * 0.85);
    display: inline-block;
    margin: 0 calc(2mm * 0.85) 0 calc(2mm * 0.85);
    position: absolute;
    top: calc(2px * 0.85);
    left: 0;
  }

  div.checkbox-label {
    min-height: calc(3mm * 0.85);
    font-size: calc(4mm * 0.85);
    width: 90%;
    margin-left: calc(8mm * 0.85);
  }

  .right-container {
    float: right;
  }

  img {
    max-height: calc(80mm * 0.85);
    max-width: calc(70mm * 0.85);
  }`
  