import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category } from 'src/app/shared/models';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {

  private categories$?: Subscription;
  categories?: Category[];

  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.categories$ = this.questionsService.categories$.subscribe(data => this.categories = data);
    this.questionsService.getCategories();
  }

  ngOnDestroy(): void {
    this.categories$?.unsubscribe();
  }

}
