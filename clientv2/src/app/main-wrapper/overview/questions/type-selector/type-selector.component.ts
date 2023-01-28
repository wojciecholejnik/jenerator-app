import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionType } from 'src/app/shared/models';

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.component.html',
  styleUrls: ['./type-selector.component.scss']
})
export class TypeSelectorComponent implements OnInit {
  @Output() onTypeSelect: EventEmitter<any> = new EventEmitter();
  @Input() questionType: QuestionType | string = '';
  selectedType: QuestionType | string = '';

  constructor() { }

  ngOnInit(): void {
    if (this.questionType.length) {
      this.selectedType = this.questionType;
    }
  }

  selectType(type: QuestionType): void {
    this.selectedType = type;
    this.onTypeSelect.emit(this.selectedType);
  }

}
