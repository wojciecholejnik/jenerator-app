import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { QuestionsService } from 'src/app/main-wrapper/questions.service';
import { Category } from 'src/app/shared/models';

@Component({
  selector: 'app-categories-modal',
  templateUrl: './categories-modal.component.html',
  styleUrls: ['./categories-modal.component.scss']
})
export class CategoriesModalComponent implements OnInit, OnDestroy {

  @Input() type!: ModalType;
  @Input() category!: Category;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
  categoryName = '';
  private request$?: Subscription;
  errorMessage = '';

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
    if (this.type == "edit") {
      this.categoryName = this.category.name
    }
  }

  ngOnDestroy(): void {
    this.request$?.unsubscribe();
  }

  closeModal(): void {
    this.onCloseModal.emit();
  }

  onInputChange() {
    this.errorMessage = '';
  }

  editCategory(): void {
    this.request$ = this.questionService.editCategory(this.category._id, this.categoryName).subscribe({
      next: (res) => {
        this.questionService.allCategories = res;
        this.questionService.filerCategories('');
        this.closeModal();
      },
      error: (e) => {
        //TODO: hadle error
      }
    })
  }

  deleteCategory(): void {
    this.request$ = this.questionService.deleteCategory(this.category._id).subscribe({
      next: (res) => {
        this.questionService.allCategories = res;
        this.questionService.filerCategories('');
        this.closeModal();
      },
      error: (e) => {
        //TODO: hadle error
      }
    })
  }

  addCategory(): void {
    if (this.categoryName.length) {
      this.request$ = this.questionService.addCategory(this.categoryName).subscribe({
        next: (res) => {
          this.questionService.allCategories = res;
          this.questionService.filerCategories('');
          this.closeModal();
        },
        error: (e) => {
          this.errorMessage = e.error.message;
        }
      })
    }
  }

}

type ModalType = 'edit' | 'delete' | 'add' | string
