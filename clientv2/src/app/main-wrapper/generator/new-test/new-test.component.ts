import { Component, Input, OnInit } from '@angular/core';
import { Category, NewTest, Test } from 'src/app/shared/models';
import { QuestionsService } from '../../questions.service';

@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html',
  styleUrls: ['./new-test.component.scss']
})
export class NewTestComponent implements OnInit {

  @Input() newTest!: NewTest | Test;

  constructor() { }

  ngOnInit(): void {
  }

  

}