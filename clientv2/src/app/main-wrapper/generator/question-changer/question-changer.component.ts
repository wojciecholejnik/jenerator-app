import { Component, ElementRef, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { NewTest, Question } from 'src/app/shared/models';
import { QuestionsService } from '../../questions.service';
import { GeneratorService } from '../generator.service';
import {map, startWith} from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-question-changer',
  templateUrl: './question-changer.component.html',
  styleUrls: ['./question-changer.component.scss']
})
export class QuestionChangerComponent implements OnInit, OnDestroy {
  
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (this.isOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @Input() question!: Question;
  isOpen = false;
  questions: Question[] = [];
  private questions$?: Subscription;

  myControl = new FormControl('');
  filteredOptions!: Observable<Question[]>;

  constructor(
    private questionsService: QuestionsService,
    private generatorService: GeneratorService,
    private eRef: ElementRef) { }

  ngOnInit(): void {
    this.questions$ = this.questionsService.questions$.subscribe((questions: Question[]) => {
      if (questions) {
        this.questions = questions.filter(question =>
          !question.blocked
           && question.type === this.question.type
           && question._id !== this.question._id
           && !this.isInTheTest(question._id)
        )
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map((value: Question) => this._filter(value || '')),
        );
      }
    });
    this.questionsService.getQuestionsByCategory(this.question.category._id);
  }

  isInTheTest(questionId?: string): boolean {
    const testQuestions: Question[] = this.generatorService.newTest$.getValue().questions;
    return testQuestions.find(question => question._id == questionId) ? true : false
  }

  ngOnDestroy(): void {
    this.questions$?.unsubscribe();
  }

  open(): void {
    if (!this.questions.length) {
      this.questionsService.getQuestionsByCategory(this.question.category._id);
    }
    this.isOpen = true;
  }

  selectQuestion(event: MatAutocompleteSelectedEvent ) {
    const test: NewTest = this.generatorService.newTest$.getValue();
    const index = test.questions.findIndex(question => question._id === this.question._id);
    test.questions[index] = event.option.value;
    this.generatorService.newTest$.next(test);
    this.isOpen = false;
  }

  
  displayFn(value?: Question) {
    return value ? value.questionContent : '';
  }

  private _filter(value: Question | string): Question[] {
    const filterValue = typeof value === 'string' ? value.toLocaleLowerCase() : value.questionContent.toLowerCase();
    return this.questions.filter(option => option.questionContent.toLowerCase().includes(filterValue));
  }
}




