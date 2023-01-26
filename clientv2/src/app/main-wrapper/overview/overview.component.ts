import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/shared/models';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  categories$?: Subscription;
  categories?: Category[];

  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.categories$ = this.questionsService.categories$.subscribe(data => {
      if (data) {
        this.categories = data;
      }
    });
    this.questionsService.getCategories();
  }

  ngOnDestroy(): void {
    this.categories$?.unsubscribe();
  }

}
