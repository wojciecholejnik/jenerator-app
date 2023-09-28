import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LoginService } from 'src/app/login/login.service';
import { NewTest, Question, QuestionSpecies, Tag } from 'src/app/shared/models';
import { QuestionsService } from '../questions.service';
import { ToastService } from 'src/app/shared/toast-service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class GeneratorService implements OnDestroy {

  constructor(
    private loginService: LoginService,
    private questionsService: QuestionsService,
    private toastService: ToastService ) { }

    ngOnDestroy(): void {
      this._questions?.unsubscribe();
    }

  emptyTest: NewTest = {
    category: undefined,
    author: this.loginService.getAuthor(),
    date: new Date(),
    questions: [],
  }
  
  newTest$: BehaviorSubject<any> = new BehaviorSubject(null);
  generatePending$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private searchIteration = 0;
  private allQuestionfForCategory: Question[] = [];
  private _questions?: Subscription;

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

  private getRandomQuestion = (questions: Question[]): Question => {
    const countRandomIndex = () => Math.floor(Math.random() * questions.length);
    const randomIndex = countRandomIndex();
    const randomQuestion = questions.splice(randomIndex, 1);
      return randomQuestion[0]
  }

  private computeQuestion(questions: Question[]): void {
    const singleSelectQuestionsKnowledge = questions.filter(
      question => question.type === 'singleSelect' && !question.blocked && question.species === QuestionSpecies.knowledgeTask
    );
    const multiSelectQuestionsKnowledge = questions.filter(
      question => question.type === 'multiSelect' && !question.blocked && question.species === QuestionSpecies.knowledgeTask
      );
    const openQuestionsKnowledge = questions.filter(
      question => question.type === 'open' && !question.blocked && question.species === QuestionSpecies.knowledgeTask
    );

    const singleSelectQuestionsCalculate = questions.filter(question => question.type === 'singleSelect' && !question.blocked && question.species === QuestionSpecies.countingTask);
    const multiSelectQuestionsCalculate = questions.filter(question => question.type === 'multiSelect' && !question.blocked && question.species === QuestionSpecies.countingTask);
    const openQuestionsCalculate = questions.filter(question => question.type === 'open' && !question.blocked && question.species === QuestionSpecies.countingTask);

    if (singleSelectQuestionsKnowledge.length < 1 || multiSelectQuestionsKnowledge.length < 1 || openQuestionsKnowledge.length < 1
      || singleSelectQuestionsCalculate.length < 1 || multiSelectQuestionsCalculate.length < 1 || openQuestionsCalculate.length < 1) {
        this.toastService.show("Za mała ilość pytań/tagów w wybranej kategorii.", { classname: 'bg-danger text-light', autohide: false })
      return
    }

    const randomQuestions: Question[] = [];

    randomQuestions.push(this.getRandomQuestion(singleSelectQuestionsKnowledge));
    randomQuestions.push(this.getRandomQuestion(singleSelectQuestionsCalculate));
    randomQuestions.push(this.getRandomQuestion(multiSelectQuestionsKnowledge));
    randomQuestions.push(this.getRandomQuestion(multiSelectQuestionsCalculate));
    randomQuestions.push(this.getRandomQuestion(openQuestionsKnowledge));
    randomQuestions.push(this.getRandomQuestion(openQuestionsCalculate));

    const isOk = this.checkTagsRepeatability(randomQuestions, questions);

    if (isOk) {
      this.generatePending$.next(false);
      this.searchIteration = 0;
    }

    this.newTest$.next({...this.newTest$.getValue(), questions: randomQuestions})
  }

  private checkTagsRepeatability = (randomQuestions: Question[], allQuestions: Question[]): boolean => {

    const includedTags: Tag[] = [];
    randomQuestions.forEach(question => {
      question.tags?.forEach(questionTag => {
        if (!includedTags.find(item => item._id === questionTag._id)) {
          includedTags.push(questionTag)
        }
      })
    })

    const countedQuestions:Question[][] = [];
    includedTags.forEach(tag => {
      const questionsWithTag = randomQuestions.filter(question => question.tags?.map(item => item._id).includes(tag._id));
      countedQuestions.push(questionsWithTag)
    })

    const indexes: number[] = [];
    countedQuestions.forEach(questionsGroup => {
      if (questionsGroup.length <= 2) return
      questionsGroup.forEach(question => {
        const index = randomQuestions.findIndex(item => item._id === question._id);
        if (index >= 0 ) indexes.push(index)
      })
    })

    if (!indexes.length) return true
    
    const tagsFilter = (questionTags: Tag[], included: Tag[]): boolean => {
      const mappedQuestionTags = questionTags.map(item => item._id);
      const mappedIncluded = included.map(item => item._id);
      return !(mappedIncluded.some(r=> mappedQuestionTags.includes(r)))
    }

    let isOk = false;

    for (let i = 0; i < indexes.length-2; i++) {
      const questionToChange = randomQuestions[indexes[i]]
      const remplacementQuestion = allQuestions.filter(question => {
        return !(randomQuestions.find(item => item._id === question._id))
        && question.type === questionToChange.type
        && question.species === questionToChange.species
        && tagsFilter(question.tags || [], includedTags)
      })
      
      if (remplacementQuestion.length) {
        randomQuestions[indexes[i]] = this.getRandomQuestion(remplacementQuestion)
        isOk = true
      } else {
        this.searchIteration ++
        this.getRandomQuestions()
        isOk = false
      }
    }
    return isOk
  }

  getRandomQuestions() {

    if (this.searchIteration >= 10) {
      this.searchIteration = 0;
      this.toastService.show("Za mała ilość pytań/tagów w wybranej kategorii.", { classname: 'bg-danger text-light', autohide: false });
      this.generatePending$.next(false);
      return
    }
    if (this.searchIteration === 0 || !this.allQuestionfForCategory.length) {
      this.generatePending$.next(true);
      const category = this.questionsService.getSelectedCategory();
      this._questions = this.questionsService.getAllQuestionsForTest(category._id).subscribe(questions => {
        this.allQuestionfForCategory = questions;
        this.computeQuestion(questions);
      });
      return
    }
    if (this.searchIteration > 0) {
      this.computeQuestion(this.allQuestionfForCategory)
    }

  }

  isNewTestValid(test: NewTest): boolean {
    if (test.author && test.category && test.questions.length === 6) {
      return true
    }  else {
      return false
    }
  }

}
