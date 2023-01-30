import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Test } from 'src/app/shared/models';
import { GeneratorService } from '../generator.service';
import { PrintService } from '../print.service';

@Component({
  selector: 'app-test-preview',
  templateUrl: './test-preview.component.html',
  styleUrls: ['./test-preview.component.scss']
})
export class TestPreviewComponent implements OnInit {

  @Input() test!: Test;
  @Output() onPreviewClose: EventEmitter<any> = new EventEmitter();

  constructor(private printService: PrintService) { }

  ngOnInit(): void {
  }

  closePreview(): void {
    this.onPreviewClose.emit();
  }

  printUnresolvedTest(): void {
    this.printService.printUnresolvedTest(this.test)
  }

  printResolvedTest(): void {
    this.printService.printResolvedTest(this.test)
  }

}
