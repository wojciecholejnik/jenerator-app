import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from 'src/app/shared/api.service';
import { Category, Tag, TagDTO } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/toast-service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class TagsService implements OnDestroy {

  public tagEditorIsOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public tags: BehaviorSubject<Tag[] | undefined> = new BehaviorSubject<Tag[] | undefined>(undefined)
  public loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  public editingLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  private _tags?: Subscription

  constructor(private apiService: ApiService, private toastService: ToastService) { }

  ngOnDestroy(): void {
    this._tags?.unsubscribe();
  }

  openTagEditor(category: Category): void {
    this.tagEditorIsOpen.next(true);
    this.getTags(category._id);
  }

  closeTagEditor(): void {
    this.tagEditorIsOpen.next(false)
    this.tags.next(undefined)
  }

  getTags(categoryId: string): void {
    this.loading.next(true);
    this._tags = this.apiService.getTagsForCategory(categoryId).subscribe({
      next: res => {
        if (res && res.length) {
          this.tags.next(res);
          this.loading.next(false);
        } else {
          this.tags.next(undefined);
          this.loading.next(false);
        }
      },
      error: (e) => {
        if (e.status === 404) {
          this.tags.next(undefined);
          this.loading.next(false);
        }
      }
    })
  }

  addTag(tag: TagDTO): void {
    this.loading.next(true);
    this._tags = this.apiService.addTag(tag).subscribe(res => {
      if (res && res.length) {
        this.loading.next(false);
        this.tags.next(res)
      } else {
        this.tags.next(undefined)
        this.loading.next(false);
      }
    })
  }

  deleteTag(tag: Tag): void {
    this.loading.next(true);
    this._tags = this.apiService.deleteTag(tag).subscribe({
      next: res => {
        if (res && res.length) {
          this.tags.next(res);
          this.loading.next(false);
        } else {
          this.tags.next(undefined);
          this.loading.next(false);
        };
        this.toastService.show("Tag został usunięty.", { classname: 'bg-success text-light', delay: 1500 })
      },
      error: e => {
        if (e.status === 405) {
          this.toastService.show(e.error.message, { classname: 'bg-danger text-light', autohide: false })
        } else if (e.status === 404)
        this.tags.next([]);
        this.loading.next(false);
      }
    })
  }

  editTag(tag: Tag): void {
    this.editingLoading.next(true);
    this.apiService.editTag(tag).subscribe({
      next: res => {
        this.tags.next(res);
        this.editingLoading.next(false);
        this.toastService.show("Tag został zmieniony.", { classname: 'bg-success text-light', delay: 1500 })
      },
      error: () => {
        this.toastService.show("Nie udało się edytować tagu.", { classname: 'bg-danger text-light', autohide: false })
        this.editingLoading.next(false);
      }
    })
  }
}
