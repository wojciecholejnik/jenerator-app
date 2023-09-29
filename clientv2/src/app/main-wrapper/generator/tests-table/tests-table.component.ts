import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NewTest, PaginationInfo, Test } from 'src/app/shared/models';
import { TestService } from '../test.service';

@Component({
  selector: 'app-tests-table',
  templateUrl: './tests-table.component.html',
  styleUrls: ['./tests-table.component.scss'],
  providers: [DatePipe]
})
export class TestsTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tests!: Test[];
  testToShow: Test[] = [];
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

  ngOnChanges(): void {
    if (!this.tests) return

    if(this.minIndex + this.numberOfRows > this.tests.length) {
      this.minIndex = 0;
      this.maxIndex = this.numberOfRows;
    }
    this.countPages();

    this.setButtons();
    this.testToShow = this.tests.slice(this.minIndex, this.maxIndex);
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

  numberOfRows = 10;
  minIndex=0;
  maxIndex=this.numberOfRows;
  btnPrevDisabled = true;
  btnResetDisabled = true;
  btnNextDisabled = this.tests ? this.tests.length > this.numberOfRows : true;
  pagesAmount = 0;
  showingPage = 1;
  allQuestionsAmount = 0;

  changeRange(direction: 'asc' | 'desc' | 'reset') {
    if (direction === 'asc' && this.minIndex + this.numberOfRows < this.tests.length) {
      this.minIndex += this.numberOfRows;
      this.maxIndex += this.numberOfRows;
      this.showingPage ++
    } else if (direction === 'desc' && this.minIndex > 0) {
      this.minIndex -= this.numberOfRows;
      this.maxIndex -= this.numberOfRows;
      this.showingPage --
    } else if (direction === 'reset') {
      this.minIndex = 0;
      this.maxIndex = this.numberOfRows;
      this.showingPage = 1;
    }

    this.setButtons();
    this.countPages();
    this.testToShow = this.tests.slice(this.minIndex, this.maxIndex).map((claim: any) => {
      return {
        ...claim,
        isChecked: false,
      }
    });
  }

  setButtons(){
    this.btnNextDisabled = this.maxIndex >= this.tests.length;
    this.btnPrevDisabled = this.minIndex <= 0;
    this.btnResetDisabled = this.minIndex <= 0;
  }

  countPages(): void {
    this.pagesAmount = Math.ceil(this.tests.length / this.numberOfRows);
    this.allQuestionsAmount = this.tests.length; 
  }

  setPaginationInfo(): PaginationInfo {
    return {
      allQuestionsAmount: this.allQuestionsAmount,
      showingPage: this.showingPage,
      pagesAmount: this.pagesAmount,
      btnNextDisabled: this.btnNextDisabled,
      btnPrevDisabled: this.btnPrevDisabled,
      btnResetDisabled: this.btnResetDisabled
    }
  }

}
