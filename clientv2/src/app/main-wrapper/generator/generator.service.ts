import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { NewTest, Question, QuestionSpecies } from 'src/app/shared/models';
import { QuestionsService } from '../questions.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService {

  constructor(private loginService: LoginService, private questionsService: QuestionsService) { }

  emptyTest: NewTest = {
    category: undefined,
    author: this.loginService.getAuthor(),
    date: new Date(),
    questions: [],
  }
  
  newTest$: BehaviorSubject<any> = new BehaviorSubject(null);

  startNewTest(): void {
    this.emptyTest.author = this.loginService.getAuthor(),
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

      const singleSelectQuestionsKnowledge = questions.filter(question => question.type === 'singleSelect' && !question.blocked && question.species === QuestionSpecies.knowledgeTask);
      const multiSelectQuestionsKnowledge = questions.filter(question => question.type === 'multiSelect' && !question.blocked && question.species === QuestionSpecies.knowledgeTask);
      const openQuestionsKnowledge = questions.filter(question => question.type === 'open' && !question.blocked && question.species === QuestionSpecies.knowledgeTask);

      const singleSelectQuestionsCalculate = questions.filter(question => question.type === 'singleSelect' && !question.blocked && question.species === QuestionSpecies.countingTask);
      const multiSelectQuestionsCalculate = questions.filter(question => question.type === 'multiSelect' && !question.blocked && question.species === QuestionSpecies.countingTask);
      const openQuestionsCalculate = questions.filter(question => question.type === 'open' && !question.blocked && question.species === QuestionSpecies.countingTask);

      if (singleSelectQuestionsKnowledge.length < 1 || multiSelectQuestionsKnowledge.length < 1 || openQuestionsKnowledge.length < 1
        || singleSelectQuestionsCalculate.length < 1 || multiSelectQuestionsCalculate.length < 1 || openQuestionsCalculate.length < 1) {
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

      randomQuestions.push(getRandomQuestion(singleSelectQuestionsKnowledge));
      randomQuestions.push(getRandomQuestion(singleSelectQuestionsCalculate));
      randomQuestions.push(getRandomQuestion(multiSelectQuestionsKnowledge));
      randomQuestions.push(getRandomQuestion(multiSelectQuestionsCalculate));
      randomQuestions.push(getRandomQuestion(openQuestionsKnowledge));
      randomQuestions.push(getRandomQuestion(openQuestionsCalculate));

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

}
