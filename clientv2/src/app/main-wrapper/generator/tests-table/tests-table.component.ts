import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NewTest, Test } from 'src/app/shared/models';

@Component({
  selector: 'app-tests-table',
  templateUrl: './tests-table.component.html',
  styleUrls: ['./tests-table.component.scss'],
  providers: [DatePipe]
})
export class TestsTableComponent implements OnInit {

  @Input() tests!: Test[];
  selectedTest?: Test;
  testPreviewIsOpen = false;
  deleteConfirmationIsOpen = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleTestPreview(test?: Test): void {
    if (test) {
      this.selectTest(test);
      this.testPreviewIsOpen = true;
    } else {
      this.selectTest();
      this.testPreviewIsOpen = false;
    }
  }

  selectTest(test?: Test) {
    this.selectedTest = test ? test : undefined
  }

  toggleRemoveConfirmation(test?: Test): void {
    if (test) {
      this.selectTest(test);
      this.deleteConfirmationIsOpen = true;
    } else {
      this.selectTest();
      this.deleteConfirmationIsOpen = false;
    }
  }

}
