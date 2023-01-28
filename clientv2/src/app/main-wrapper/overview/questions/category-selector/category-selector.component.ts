import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category } from 'src/app/shared/models';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {

  @Input() categories!: Category[];
  @Input() disabled?: boolean;
  inputPhrase = '';
  selectedCategory$?: Subscription;
  selectedCategory?: Category;
  isOpen = true;

  constructor(private questionsService: QuestionsService) { }

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
    if (this.selectedCategory) {
      this.isOpen = false;
    }

  }

  search(): void {
    this.questionsService.filerCategories(this.inputPhrase);
  }

  selectCategory(category: Category): void {
    this.questionsService.selectedCategory$.next(category)
  }

  isSelected(category: Category): boolean {
    return this.selectedCategory === category
  }

  toggleIsOpen() {
    if (this.disabled) return;

    if (!this.isOpen) {
      this.questionsService.selectedCategory$.next('');
      this.questionsService.filerCategories('');
    } else {
      this.isOpen = false
    }
  }



}
