import { AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../data-service.service';
import { ToastService } from '../toast/toast.service';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.scss']
})
export class EditQuestionComponent implements OnInit, AfterContentInit {
  @Output() onEditClose: EventEmitter<boolean> = new EventEmitter();
  @Input() question!: QuestionToUpdate;
  questionToUpdate!: QuestionToUpdate;
  modalContainer: HTMLElement | null = null;


  constructor(private dataService: DataService, private toastService: ToastService) { }

  ngOnInit(): void {
    this.questionToUpdate = {...this.question};
  }

  ngAfterContentInit(): void {
    this.modalContainer = document.getElementById('modal-container');
    const backgroundColor = localStorage.getItem('background')
    if (this.modalContainer && backgroundColor) {
      this.modalContainer.style.background = backgroundColor;
    }
  }

  closeModal(){
    this.onEditClose.emit();
  }

  disableSendButton() {
    const {category, type, answers, questionContent, img} = this.questionToUpdate;
    let amountOfAns = 0;
    let amountOfRightAns = 0
    answers.forEach(answer => {
      if (answer.isRight) {
        amountOfRightAns += 1;
      }
      if (answer.content.length) {
        amountOfAns += 1
      }
    });

    if (type === 'singleSelect') {
      return !(category.length && questionContent.length && amountOfAns === 4 && amountOfRightAns === 1)
    } else if (type === 'multiSelect') {
      return !(category.length && questionContent.length && amountOfAns === 4 && amountOfRightAns > 0)
    } else if (type === 'open') {
      return !(category.length && questionContent.length)
    } else {
      return true
    }

  }

  updateQuestion(){
    this.dataService.updateData(this.questionToUpdate).subscribe({
      next: () => {
        this.toastService.show('zmiany zostały zapisane', { classname: 'bg-success text-light', delay: 5000 });
        this.dataService.getData();
        this.closeModal();
      },
      error: (e) => this.toastService.show('coś poszło nie tak !', { classname: 'bg-danger text-light', delay: 5000 })
      ,
    });
  }

}

interface QuestionToUpdate {
  _id: string;
  answers: Answer[] | [];
  category: string;
  img: string | null;
  questionContent: string;
  type: 'singleSelect' | 'multiSelect' | 'open';
}

interface Answer {
  content: string;
  isRight: boolean;
}
