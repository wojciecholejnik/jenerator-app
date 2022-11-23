import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { DataService } from '../data-service.service';
import { Category } from '../shared/interafaces';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-add-multi',
  templateUrl: './add-multi.component.html',
  styleUrls: ['./add-multi.component.scss']
})
export class AddMultiComponent implements OnInit {
  @ViewChildren('checkbox') checkboxes?: ElementRef[];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  filter = '';
  getDataRequestPending = false;
  activeCategory: string = '';   
  creatingNewCategory: boolean = false;
  questionContent: string = '';
  imgURL: string = '';
  answers = [
    {content: '', isRight: false},
    {content: '', isRight: false},
    {content: '', isRight: false},
    {content: '', isRight: false},
  ];
  fileToUpload: File | null = null;

  constructor(private dataService: DataService, private toastService: ToastService) { 
  }

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
      type: 'multiSelect',
      answers: this.answers, 
      category: this.activeCategory,
      questionContent: this.questionContent,
      img: '',
    };

    const formData:FormData = new FormData();
    if (this.fileToUpload) {
      formData.append('upload', this.fileToUpload, this.fileToUpload.name);
      const params = new HttpParams();
      const options = {
        params: params,
      };
      this.dataService.addFile(formData, options).subscribe({
        next: (res: {fileName: string}) => {
          question.img = res.fileName;
          this.sendQuestionContent(question);
        },
        error: (e) => {
          this.handleError(e);
        }
      });
    } else {
      this.sendQuestionContent(question);
    }
  }

  sendQuestionContent(question: any) {
    this.dataService.addQuestion(question).subscribe({
      next: () => this.handleSucces(),
      error: (e) => this.handleError(e)
    })
  }

  handleSucces() {
    this.toastService.show('pytanie zostało dodane', { classname: 'bg-success text-light', delay: 5000 })
    this.clear();
    this.dataService.getData();
  }

  handleError(e: any) {
    this.toastService.show('coś poszło nie tak :(', { classname: 'bg-danger text-light', delay: 5000 })
  }

  isButtonDisabled(){
    let amountOfAnswers = 0;
    let amountOfGoodAnswers = 0;
    this.answers.forEach(answer => {
      if (answer.content.length > 0) {
        amountOfAnswers +=1;
      }
      if (answer.isRight === true) {
        amountOfGoodAnswers +=1;
      }
    })
    return amountOfAnswers !== 4 || amountOfGoodAnswers === 0 
  }

  clear(){
    this.answers.forEach(answer => {
      answer.content = "";
      answer.isRight = false;
    });
    this.imgURL = "";
    this.questionContent = "";
  }

  search(clear?: boolean){
    if (clear) {
      this.filter = '';
    }
    this.filteredCategories = this.categories.filter(category => category.name.toLowerCase().includes(this.filter.toLowerCase()));
    this.filteredCategories.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

}
