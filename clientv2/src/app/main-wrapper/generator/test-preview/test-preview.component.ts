import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Test } from 'src/app/shared/models';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.scss']
})
export class TestPreviewComponent implements OnInit {

  @Input() test!: Test;
  @Output() onPreviewClose: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  closePreview(): void {
    this.onPreviewClose.emit();
  }

  print(): void {
    
  }

}
