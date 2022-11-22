import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from '../data-service.service';
import { Category, TestToSave } from '../shared/interafaces';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.scss']
})
export class GenerateComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  filter = '';
  activeCategory: string = '';
  activeType: string = '';
  filteredData: any;
  filteredByCategory: any;
  randomQuestions: any = [];
  subscription?: Subscription;
  downloading = false;
  getDataRequestPending = false;
  notEnoughQuestions = false;

  constructor(public dataService: DataService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getDataRequestPending = true;
    this.dataService.getData();
    this.subscription = this.dataService.subscribeData2().subscribe(data => {
      if (data) {
        this.randomQuestions = data;
      }
    });
    this.dataService.subjectedCategories.subscribe(categories => {
      this.categories = categories;
      this.search(true);
      this.getDataRequestPending = false;
    });
  }

  setActiveCategory(name?: string, event?: any) {
    if (name && name !== 'clear-button') {
      this.activeCategory = name;
    } else if (name && name === 'clear-button') {
      this.activeCategory = '';
    } else if (event && event.target && event.target.value ) {
      this.activeCategory = event.target.value;
    }
    this.filterDate();
    this.filterByType(this.activeType);
    this.randomQuestions = [];
  }

  filterDate() {
    this.filteredData = this.dataService.data.filter((question: { category: string; }) => question.category === this.activeCategory);
  }

  filterByType(type: string) {
    this.filteredByCategory = this.filteredData.filter((question: {type: string}) => question.type === type);
    this.activeType = type;
  }

  getRandom(){
    this.downloading = true;
    this.notEnoughQuestions = false;
    this.randomQuestions = [];
    this.dataService.getRandom(this.activeCategory).subscribe({
      next: (randomQuestions) => {
        this.dataService.randomQuestions = randomQuestions;
        this.randomQuestions = randomQuestions;
        this.toastService.show('szablon został wygenerowany', { classname: 'bg-success text-light', delay: 5000 })
        this.downloading = false;
      },
      error: (e) => {
        if (e.error.message === 'za mało pytań w wybranej kategorii') {
          this.notEnoughQuestions = true
        }
        this.toastService.show('szablon nie został wygenerowany', { classname: 'bg-danger text-light', delay: 5000 })
        this.downloading = false;
      }
    })
  }

  downloadPdf(){
    this.downloading = true;
    const questionsToSend = {
      category: this.activeCategory,
      composer: sessionStorage.getItem('shortName'),
      emoticon: sessionStorage.getItem('emoticon'),
      singleSelect: {
        1: {...this.randomQuestions.singleSelect[0]},
        2: {...this.randomQuestions.singleSelect[1]},
      },
      multiSelect: {
        1: {...this.randomQuestions.multiSelect[0]},
        2: {...this.randomQuestions.multiSelect[1]},
      },
      open: {
        1: {...this.randomQuestions.open[0]},
        2: {...this.randomQuestions.open[1]},
      }
    };

    this.dataService.downloadPdf(questionsToSend).subscribe({
      next: (res) => {
        const file = new Blob([res], {type: res.type});
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = `Test - ${this.activeCategory.replace(/.\s*$/, "")}.pdf`;
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
      category: this.activeCategory,
      composer: sessionStorage.getItem('shortName'),
      emoticon: sessionStorage.getItem('emoticon'),
      singleSelect: {
        1: {...this.randomQuestions.singleSelect[0]},
        2: {...this.randomQuestions.singleSelect[1]},
      },
      multiSelect: {
        1: {...this.randomQuestions.multiSelect[0]},
        2: {...this.randomQuestions.multiSelect[1]},
      },
      open: {
        1: {...this.randomQuestions.open[0]},
        2: {...this.randomQuestions.open[1]},
      }
    };

    this.dataService.downloadResolvedPdf(questionsToSend).subscribe({
      next: (res) => {
        const file = new Blob([res], {type: res.type});
        const blob = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = blob;
        link.download = `Rozwiąznie - ${this.activeCategory.replace(/.\s*$/, "")}.pdf`;
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

  search(clear?: boolean){
    if (clear) {
      this.filter = '';
    }
    this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(this.filter.toLowerCase()));
    this.filteredCategories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  saveTest(){
    const testToSave: TestToSave = {
      author: sessionStorage.getItem('displayName') || 'unknown',
      category: this.activeCategory,
      questions: this.randomQuestions,
    } 
    this.dataService.saveTest(testToSave).subscribe({
      next: () => {
        this.toastService.show('test został zapisany', { classname: 'bg-success text-light', delay: 5000 });
      },
      error: (e) => {
        if (e.error.message === 'test już istnieje') {
          this.toastService.show('taki test już istnieje', { classname: 'bg-danger text-light', delay: 5000 });
        } else {
          this.toastService.show('nie udało się zapisać testu :(', { classname: 'bg-danger text-light', delay: 5000 });
        }
      }
    });
  }

}
