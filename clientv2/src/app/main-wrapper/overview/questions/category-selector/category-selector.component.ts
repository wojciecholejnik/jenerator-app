import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GeneratorService } from 'src/app/main-wrapper/generator/generator.service';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category, NewTest, TestToSaveDTO } from 'src/app/shared/models';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit, OnDestroy {

  @Input() categories!: Category[];
  @Input() disabled?: boolean;
  private selectedCategory$?: Subscription;
  private isNewTest$?: Subscription;
  inputPhrase = '';
  selectedCategory?: Category;
  isOpen = true;
  isDisabled = (): boolean => {
    return this.newTest && this.newTest.category ? true : false
  }
  newTest?: NewTest;

  constructor(private questionsService: QuestionsService, private generatorService: GeneratorService) { }

  ngOnInit(): void {
    this.selectedCategory$ = this.questionsService.selectedCategory$.subscribe(data => {
      if (data) {
        this.selectedCategory = data;
        this.inputPhrase = data.name
        this.isOpen = false;
      } else {
        this.selectedCategory = undefined;
        this.isOpen = true;
        this.inputPhrase = '';
      }
    })
    this.isNewTest$ = this.generatorService.newTest$.subscribe(test => {
      if (test) {
        this.newTest = test;
      }
      else {
        this.newTest = undefined;
      }
      this.disableCategory();
    })
    if (this.selectedCategory) {
      this.isOpen = false;
    }

  }
  ngOnDestroy(): void {
    this.selectedCategory$?.unsubscribe();
    this.isNewTest$?.unsubscribe();
  }

  search(): void {
    this.questionsService.filerCategories(this.inputPhrase);
  }

  selectCategory(category: Category): void {
    this.questionsService.selectedCategory$.next(category);
  }

  isSelected(category: Category): boolean {
    return this.selectedCategory === category
  }

  toggleIsOpen() {
    if (this.disabled && this.isDisabled()) return;

    if (!this.isOpen) {
      this.questionsService.selectedCategory$.next('');
      this.questionsService.filerCategories('');
    } else {
      this.isOpen = false
    }
  }

  disableCategory(): void {
    if (this.newTest && this.newTest.category) {
      this.disabled = true;
    }
  }



}
