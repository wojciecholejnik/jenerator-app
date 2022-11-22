import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from '../data-service.service';
import { Category } from '../shared/interafaces';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-add-open',
  templateUrl: './add-open.component.html',
  styleUrls: ['./add-open.component.scss']
})
export class AddOpenComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  filter = '';
  activeCategory = '';
  creatingNewCategory = false;
  questionContent = '';
  imgURL = '';
  getDataRequestPending = false;
  fileToUpload: File | null = null;

  constructor(private dataService: DataService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.getDataRequestPending = true;
    this.dataService.subjectedCategories.subscribe(categories => {
      this.categories = categories;
      this.search(true);
      this.getDataRequestPending = false;
    });
    this.dataService.getData();
  }

  handleFileInput(event: any) {
    this.fileToUpload = event.target.files[0]
}

  setActiveCategory(name?: string, event?: any) {
    if (name && name !== 'clear-button') {
      this.activeCategory = name;
      this.creatingNewCategory = false;
    } else if (name && name === 'clear-button') {
      this.activeCategory = '';
    } else if (event && event.target && event.target.value !== '+++') {
      this.activeCategory = event.target.value;
      this.creatingNewCategory = false;
    } else {
      this.activeCategory = ''
      this.creatingNewCategory = true;
    }
  }

  sendquestion(){
    const question: {[key: string]: any} = {
      type: 'open',
      answers: [],
      category: this.activeCategory,
      questionContent: this.questionContent,
    };
    const formData:FormData = new FormData();
    if (this.fileToUpload) {
      formData.append('upload', this.fileToUpload, this.fileToUpload.name);
    }
    Object.keys(question).forEach(key => formData.append(key, question[key]));
    const params = new HttpParams();
    const options = {
      params: params,
    };

    this.dataService.postData(formData, options).subscribe({
      next: () => {
        this.dataService.getData();
        this.toastService.show('pytanie zostało dodane', { classname: 'bg-success text-light', delay: 5000 })
        this.clear();
      },
      error: (e) => {
        this.toastService.show('coś poszło nie tak :(', { classname: 'bg-danger text-light', delay: 5000 })

      }
    });
  }

  clear() {
    this.questionContent = "";
    this.imgURL = "";
  }

  search(clear?: boolean){
    if (clear) {
      this.filter = '';
    }
    this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(this.filter.toLowerCase()));
    this.filteredCategories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }
}
