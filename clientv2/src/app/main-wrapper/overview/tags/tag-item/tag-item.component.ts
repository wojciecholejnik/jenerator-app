import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Tag } from 'src/app/shared/models';

@Component({
  selector: 'app-tag-item',
  templateUrl: './tag-item.component.html',
  styleUrls: ['./tag-item.component.scss']
})
export class TagItemComponent implements OnInit, OnChanges {

  @Input() tag!: Tag
  @Input() editing!: boolean
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  editThisTag = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.editing.currentValue && changes.editing.previousValue) {
      this.editThisTag = false;
    }
  }

  deleteTag(): void {
    this.onDelete.emit();
  }

  editTag(): void {
    this.editThisTag = true;
    this.onEdit.emit();
  }

}
