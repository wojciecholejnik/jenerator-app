import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category } from 'src/app/shared/models';

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {

  @Input() categories?: Category[];

  editModalIsOpen = false;
  deleteModalIsOpen = false;
  selectedCategory: Category | null = null;

  constructor(private questionsService: QuestionsService) { }

  openEditModal(category: Category): void {
    this.selectedCategory = category;
    this.editModalIsOpen = true;
  }

  openDeleteModal(category: Category): void {
    this.selectedCategory = category;
    this.deleteModalIsOpen = true;
  }

  modalType(): string {
    return this.editModalIsOpen ? 'edit' : 'delete'
  }

  closeModal() {
    this.deleteModalIsOpen = false;
    this.editModalIsOpen = false;
  }


}
