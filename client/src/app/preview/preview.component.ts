import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { DataService } from '../data-service.service';
import { ToastService } from '../toast/toast.service';
import { Category } from '../shared/interafaces';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class PreviewComponent implements OnInit {
  @ViewChild('type') child!: any;

  data: any;
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  activeCategory: string = '';
  activeType: string = '';
  filteredData: any;
  filteredByCategory: any;
  subscription?: Subscription;
  editVisible = false;
  selectedQuestion: any;
  filter = '';
  getDataRequestPending = false;

  constructor(public dataService: DataService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getDataRequestPending = true;
    this.dataService.getData();
    this.subscription = this.dataService.subscribeData().subscribe(data => {
      if (data) {
        this.data = data;
        this.setActiveCategory({target: {value: this.activeCategory}});
      }
    });
    this.dataService.subjectedCategories.subscribe(categories => {
      this.categories = categories;
      this.search(true);
      this.getDataRequestPending = false;
    });
  }

  refreshData(){
    this.dataService.getData();
  }

  setActiveCategory(event: any) {
    if (event && event.target.value) {
      this.activeCategory = event.target.value;
      this.filterDate();
      if (this.activeType) {
        this.filterByType(null, this.activeType)
      }
    }
  }

  filterDate() {
    this.filteredData = this.dataService.data.filter((question: { category: string; }) => question.category === this.activeCategory);
  }

  filterByType(event: any, secondFiltering?: string) {
    if (event && event.target.value) {
      this.filteredByCategory = this.filteredData.filter((question: {type: string}) => question.type === event.target.value);
      this.activeType = event.target.value;
    } else if (secondFiltering) {
      this.filteredByCategory = this.filteredData.filter((question: {type: string}) => question.type === secondFiltering);
      this.activeType = secondFiltering;

    }
  }

  translateType(type: string): string {
    if (type === 'open') {
      return 'pytanie otwarte';
    } else if (type === 'singleSelect') {
      return 'wybór pojedynczy';
    } else if (type === 'multiSelect') {
      return 'wybór wielokrotny';
    } else {
      return ''
    }
  }

  preventEmpty($event: NgbPanelChangeEvent, question: any) {
    if (!(question.answers.length || question.img)) {
      $event.preventDefault();
    }
  }

  deleteQuestion(id: string) {
    this.dataService.deleteQuestion(id).subscribe({
      next: () => {
        this.dataService.getData();
        this.toastService.show('pytanie zostało usunięte', { classname: 'bg-success text-light', delay: 5000 })
      },
      error: () => {
        this.toastService.show('coś poszło nie tak :(', { classname: 'bg-danger text-light', delay: 5000 })
      }
    });
  }

  editClose(){
    this.editVisible = false;
  }

  selectToEdit(question: any) {
    this.selectedQuestion = question;
    this.editVisible = true;
  }

  selectCategory(category: Category) {
    this.activeCategory = category.name;
    this.filterDate();
    if (this.activeType) {
      this.filterByType(null, this.activeType)
    }
  }

  search(clear?: boolean){
    if (clear) {
      this.filter = '';
    }
    this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(this.filter.toLowerCase()));
    this.filteredCategories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }
}
