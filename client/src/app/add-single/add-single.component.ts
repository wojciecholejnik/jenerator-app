import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { DataService } from '../data-service.service';
import { Category } from '../shared/interafaces';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-add-single',
  templateUrl: './add-single.component.html',
  styleUrls: ['./add-single.component.scss']
})
export class AddSingleComponent implements OnInit  {
  @ViewChildren('checkbox') checkboxes?: ElementRef[];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  filter = '';
  activeCategory = '';
  getDataRequestPending = false;
  creatingNewCategory = false;
  questionContent = '';
  imgURL = '';
  answers = [
    {content: '', isRight: false},
    {content: '', isRight: false},
    {content: '', isRight: false},
    {content: '', isRight: false},
  ];

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

  setBox(event: any){
    this.checkboxes?.forEach(element => {
      element.nativeElement.checked = false
    });
    event.target.checked = true;
  }

  sendquestion(){
    const question = {
      type: 'singleSelect',
      answers: this.answers,
      category: this.activeCategory,
      questionContent: this.questionContent,
      img: this.imgURL
    };

    this.dataService.postData(question, {}).subscribe({
      next: () => {
        this.toastService.show('pytanie zostało dodane', { classname: 'bg-success text-light', delay: 5000 })
        this.clear();
        this.dataService.getData();
      },
      error: (e) => {
        this.toastService.show('coś poszło nie tak :(', { classname: 'bg-danger text-light', delay: 5000 })
      }
    });
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
    return amountOfAnswers !== 4 || amountOfGoodAnswers !== 1 
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
