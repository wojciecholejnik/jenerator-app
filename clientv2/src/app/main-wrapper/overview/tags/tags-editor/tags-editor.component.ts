import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TagsService } from '../tags.service';
import { Category, Tag } from 'src/app/shared/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tags-editor',
  templateUrl: './tags-editor.component.html',
  styleUrls: ['./tags-editor.component.scss']
})
export class TagsEditorComponent implements OnInit, OnDestroy {

  @Input() selectedCategory?: Category;

  editorIsOpen = false;
  tags: Tag[] = [];
  newTagValue = '';
  editTagValue = '';
  loading = false;
  editingLoading = false;
  editing = false;
  tagToEdit?: Tag;

  private _editorIsOpen?: Subscription;
  private _tags?: Subscription;
  private _loading?: Subscription;
  private _editingLoading?: Subscription;

  constructor(private tagsService: TagsService) { }


  ngOnInit(): void {
    this._editorIsOpen = this.tagsService.tagEditorIsOpen.subscribe(state => this.editorIsOpen = state);
    this._tags = this.tagsService.tags.subscribe(tags => {
      if (tags) {
        this.tags = tags
      } else {
        this.tags = []
      }
    });
    this._loading = this.tagsService.loading.subscribe(state => this.loading = state);
    this._editingLoading = this.tagsService.editingLoading.subscribe(state => {
      this.editingLoading = state;
      if (!state) {
        this.abortEditing();
      }
    });
  }

  ngOnDestroy(): void {
    this._editorIsOpen?.unsubscribe();
    this._tags?.unsubscribe();
    this._loading?.unsubscribe();
    this._editingLoading?.unsubscribe();
  }

  closeModal(): void {
    this.tagsService.closeTagEditor();
  }
  
  addTag(e?: KeyboardEvent): void {
    if (e) {
      const inputElem = e.target as HTMLInputElement;
      if (inputElem.value.length > 0) {
        this.tagsService.addTag(
          {
            category: this.selectedCategory ? this.selectedCategory._id : '',
            name: inputElem.value
          })
        this.newTagValue = '';
      } 
    } else {
      if (this.newTagValue.length > 0) {
        this.tagsService.addTag(
          {
            category: this.selectedCategory ? this.selectedCategory._id : '',
            name: this.newTagValue
          })
          this.newTagValue = '';
      } 
    }
  }

  deleteTag(tag: Tag): void {
    this.tagsService.deleteTag(tag);
  }

  startEditTag(tag: Tag, elem: any): void {
    this.tagToEdit = tag;
    this.editing = true;
    this.editTagValue = tag.name;
    setTimeout(() => document.getElementById('editInput')?.focus(), 50)
  }

  editTag(): void {
    if (!this.tagToEdit || !this.editTagValue.length) return;
    this.tagsService.editTag({
      _id: this.tagToEdit._id,
      category:this.tagToEdit.category,
      name: this.editTagValue
    });
  }

  abortEditing(): void {
    this.tagToEdit = undefined;
    this.editing = false;
    this.editTagValue = '';
  }

}
