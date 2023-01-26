import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';

@Component({
  selector: 'app-categories-search',
  templateUrl: './categories-search.component.html',
  styleUrls: ['./categories-search.component.scss']
})
export class CategoriesSearchComponent implements OnInit, OnDestroy {

  phrase$?: Subscription;
  phrase = '';
  inputPhrase = ''

  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.phrase$ = this.questionsService.categoryFilterPhrase$.subscribe(phrase => this.phrase = phrase);
  }

  ngOnDestroy(): void {
    this.phrase$?.unsubscribe();
  }

  search() {
    this.questionsService.filerCategories(this.inputPhrase);
  }

  clear() {
    this.inputPhrase = '';
    this.search();
  }

}
