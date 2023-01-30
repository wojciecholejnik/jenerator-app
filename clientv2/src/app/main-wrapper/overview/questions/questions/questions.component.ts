import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneratorService } from 'src/app/main-wrapper/generator/generator.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category, Question } from 'src/app/shared/models';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss']
})
export class QuestionsComponent implements OnInit, OnDestroy {

  private categories$?: Subscription;
  private selectedCategory$?: Subscription;
  private questions$?: Subscription;
  categories?: Category[];
  questions?: any;
  selectedCategory?: Category;
  categoriesLoading = true;
  questionsLoading = true;
  addModalIsOpen = false;

  constructor(private questionsService: QuestionsService) { }

  ngOnInit(): void {
    this.categories$ = this.questionsService.categories$.subscribe(data => {
      if (data) {
        this.categories = data;
        this.categoriesLoading = false;
      } else {
        this.categories = undefined;
        this.categoriesLoading = false;
      }
    });
    this.questions$ = this.questionsService.questions$.subscribe(data => {
      if (data) {
        this.questions = data;
        this.questionsLoading = false;
      } else {
        this.questions = undefined;
        this.questionsLoading = false;
      }
    });
    this.selectedCategory$ = this.questionsService.selectedCategory$.subscribe(data => {
      if (data) {
        this.questionsLoading = true;
        this.selectedCategory = data;
        this.questionsService.getQuestionsByCategory(data._id)
      } else {
        this.selectedCategory = undefined;
      }
    });
    this.questionsService.getCategories();
  }

  ngOnDestroy(): void {
    this.categories$?.unsubscribe();
    this.questions$?.unsubscribe();
    this.selectedCategory$?.unsubscribe();
  }

  toggleAddModal() {
    this.addModalIsOpen = !this.addModalIsOpen;
  }

}
