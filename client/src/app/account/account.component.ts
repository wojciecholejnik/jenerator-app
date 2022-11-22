import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service.service';
import { Test } from '../shared/interafaces';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  
  displayName = '';
  email = '';
  shortName = '';
  emoticon = '';
  isAdmin: any;

  modalType = ''
  modalIsOpen = false;

  tests: Test[] = [];
  filteredTests : Test[] = [];
  pendingRequest = false;
  requestError = false;
  selectedTest: Test | null = null;
  previewIsActive = false;
  downloading = false;

  filter = {
    category: '',
    date: '',
    author: '',
  }

  constructor(private dataService: DataService, private toastService: ToastService) { }


  ngOnInit(): void {
    this.getTests();
    this.displayName = sessionStorage.getItem('displayName') || '';
    this.email = sessionStorage.getItem('email') || '';
    this.shortName = sessionStorage.getItem('shortName') || '';
    this.emoticon = sessionStorage.getItem('emoticon') || '';
    this.isAdmin = sessionStorage.getItem('isAdmin') || false;
  }
  
  openModal(type: 'passwordChange' | 'nameChange' | 'loginChange' | 'emoticonChange' | 'backgroundChange'){
    this.modalType = type;
    this.modalIsOpen = true;
  }

  closeModal(){
    this.modalType = '';
    this.modalIsOpen = false;
  }

  getTests(){
    this.dataService.getTests().subscribe({
      next: (tests: Test[]) => {
        this.tests = tests;
        this.filteredTests = tests.sort((a, b) => a.date.localeCompare(b.date)).reverse();
        this.pendingRequest = false;
      },
      error: (e) => {
        this.requestError = true;
        this.pendingRequest = false;
      }
    })
  }

  filtering() {
    let pipe = new DatePipe('en-US');
    this.filteredTests = this.tests.filter(test => 
      test.category.toLowerCase().includes(this.filter.category.toLowerCase()) 
      && pipe.transform(test.date, 'dd.MM.yyyy HH:mm')?.includes(this.filter.date)
      && test.author.toLowerCase().includes(this.filter.author.toLowerCase())
      )
  }

  categoryClear(){
    this.filter.category = '';
    this.filtering();
  }

  dateClear(){
    this.filter.date = '';
    this.filtering();
  }

  authorClear(){
    this.filter.author = '';
    this.filtering();
  }

  selectTest(test: Test, toggle?: boolean){
    if (!toggle) {
      this.selectedTest = test;
    }

    if (toggle && this.selectedTest === test) {
      this.selectedTest = null;
    } else if (toggle && this.selectedTest !== test) {
      this.selectedTest = test
    }
  }

  testPreview(test: Test) {
    this.selectTest(test, false);
    this.previewIsActive = !this.previewIsActive;
  }

  downloadPdf() {
    this.downloading = true;
    const questionsToSend = {
      category: this.selectedTest?.category,
      composer: sessionStorage.getItem('shortName'),
      emoticon: sessionStorage.getItem('emoticon'),
      singleSelect: {
        1: this.selectedTest?.questions.singleSelect[0],
        2: this.selectedTest?.questions.singleSelect[1],
      },
      multiSelect: {
        1: this.selectedTest?.questions.multiSelect[0],
        2: this.selectedTest?.questions.multiSelect[1],
      },
      open: {
        1: this.selectedTest?.questions.open[0],
        2: this.selectedTest?.questions.open[1],
      },
    };

    this.dataService.downloadPdf(questionsToSend).subscribe({
      next: (res) => {
        const file = new Blob([res], {type: res.type});
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = `Test - ${this.selectedTest?.category.replace(/.\s*$/, "")}.pdf`;
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        this.downloading = false;
        this.toastService.show('dokument został pobrany', { classname: 'bg-success text-light', delay: 5000 });
      },
      error: () => {
        this.toastService.show('błąd pobierania pliku', { classname: 'bg-danger text-light', delay: 5000 });
        this.downloading = false;
      }
    });
  }

  downloadResolvedPdf(){
    this.downloading = true;
    const questionsToSend = {
      category: this.selectedTest?.category,
      composer: sessionStorage.getItem('shortName'),
      emoticon: sessionStorage.getItem('emoticon'),
      singleSelect: {
        1: this.selectedTest?.questions.singleSelect[0],
        2: this.selectedTest?.questions.singleSelect[1],
      },
      multiSelect: {
        1: this.selectedTest?.questions.multiSelect[0],
        2: this.selectedTest?.questions.multiSelect[1],
      },
      open: {
        1: this.selectedTest?.questions.open[0],
        2: this.selectedTest?.questions.open[1],
      },
    };

    this.dataService.downloadResolvedPdf(questionsToSend).subscribe({
      next: (res) => {
        const file = new Blob([res], {type: res.type});
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = `Rozwiąznie - ${this.selectedTest?.category.replace(/.\s*$/, "")}.pdf`;
        link.dispatchEvent(new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        this.downloading = false;
        this.toastService.show('dokument został pobrany', { classname: 'bg-success text-light', delay: 5000 });
      },
      error: () => {
        this.toastService.show('błąd pobierania pliku', { classname: 'bg-danger text-light', delay: 5000 });
        this.downloading = false;
      }
    });
      
  }

  downloadAll(test: Test){
    this.selectedTest = test;
    this.downloadPdf();
    this.downloadResolvedPdf();
  }

  deleteTest(test: Test) {
    this.dataService.deleteTest(test).subscribe({
      next: () => {
        this.toastService.show('test został usunięty', { classname: 'bg-success text-light', delay: 5000 });
        this.dataService.getTests().subscribe(tests => {
          this.tests = tests;
          this.filtering();
        });
      },
      error: () => {
        this.toastService.show('nie udało się usunąć testu :(', { classname: 'bg-danger text-light', delay: 5000 });
      }
    })
  }

}

