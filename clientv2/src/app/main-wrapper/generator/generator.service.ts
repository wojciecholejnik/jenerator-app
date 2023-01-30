import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { NewTest, Question } from 'src/app/shared/models';
import { QuestionsService } from '../questions.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private loginService: LoginService, private questionsService: QuestionsService) { }

  emptyTest: NewTest = {
    category: '',
    author: this.loginService.getAuthor(),
    date: new Date(),
    questions: [],
  }
  
  newTest$: BehaviorSubject<any> = new BehaviorSubject(null);

  startNewTest(): void {
    this.newTest$.next(this.emptyTest);
  }

  abortNewTest(): void {
    this.newTest$.next('');
  }

  updateNewTest(test: NewTest): void {
    this.newTest$.next(test);
  }

  addQuestion(question: Question): void {
    const test: NewTest = {...this.newTest$.value};
    test.questions.push(question)
    this.newTest$.next(test);
  }

  getRandomQuestions() {
    const category = this.questionsService.getSelectedCategory();
    this.questionsService.getAllQuestionsForTest(category._id).subscribe(questions => {
      const singleSelectQuestions = questions.filter(question => question.type === 'singleSelect' && !question.blocked);
      const multiSelectQuestions = questions.filter(question => question.type === 'multiSelect' && !question.blocked);
      const openQuestions = questions.filter(question => question.type === 'open' && !question.blocked);

      if (singleSelectQuestions.length < 2 || multiSelectQuestions.length < 2 || openQuestions.length < 2) {
        window.alert('Niewystarczając liczba aktywnych pytań w wybranej kategorii');
        return
      }

      const getRandomQuestion = (questions: Question[]): Question => {
        const countRandomIndex = () => Math.floor(Math.random() * questions.length);
        const randomIndex = countRandomIndex();
        const randomQuestion = questions.splice(randomIndex, 1);
          return randomQuestion[0]
      }

      const randomQuestions: Question[] = [];

      randomQuestions.push(getRandomQuestion(singleSelectQuestions));
      randomQuestions.push(getRandomQuestion(singleSelectQuestions));
      randomQuestions.push(getRandomQuestion(multiSelectQuestions));
      randomQuestions.push(getRandomQuestion(multiSelectQuestions));
      randomQuestions.push(getRandomQuestion(openQuestions));
      randomQuestions.push(getRandomQuestion(openQuestions));

      this.newTest$.next({...this.newTest$.getValue(), questions: randomQuestions})
    });

  }

  isNewTestValid(test: NewTest): boolean {
    if (test.author && test.category && test.questions.length === 6) {
      return true
    }  else {
      return false
    }
  }

  saveTest(test: NewTest): void {
    console.log(test)
  }

}
