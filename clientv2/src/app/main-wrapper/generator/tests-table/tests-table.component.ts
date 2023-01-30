import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewTest, Test } from 'src/app/shared/models';
import { TestService } from '../test.service';

@Component({
  selector: 'app-tests-table',
  templateUrl: './tests-table.component.html',
  styleUrls: ['./tests-table.component.scss'],
  providers: [DatePipe]
})
export class TestsTableComponent implements OnInit, OnDestroy {

  @Input() tests!: Test[];
  private filterPhrase$?: Subscription;
  selectedTest?: Test;
  testPreviewIsOpen = false;
  deleteConfirmationIsOpen = false;
  testsFilter = {
    category: '',
    name: '',
    creation: '',
    author: ''
  }

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.filterPhrase$ = this.testService.testsFilterPhrases$.subscribe(filter => this.testsFilter = filter); 
  }

  ngOnDestroy(): void {
    this.filterPhrase$?.unsubscribe();
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

  filterTests() {
    this.testService.testsFilterPhrases$.next(this.testsFilter);
    this.testService.filterTests();
  }

  clearFilter(type: string): void {
    if (type === 'category') {
      this.testsFilter.category = '';
    }
    if (type === 'author') {
      this.testsFilter.author = '';
    }
    if (type === 'creation') {
      this.testsFilter.creation = '';
    }
    if (type === 'name') {
      this.testsFilter.name = '';
    }
    if (type === '') {
      this.testsFilter.category = '';
      this.testsFilter.author = '';
      this.testsFilter.creation = '';
      this.testsFilter.name = '';
    }
    this.filterTests()
  }

}
