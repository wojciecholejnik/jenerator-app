import { Component, Input, OnInit } from '@angular/core';
import { NewTest, Test } from 'src/app/shared/models';

@Component({
  selector: 'app-new-test',
  templateUrl: './new-test.component.html',
  styleUrls: ['./new-test.component.scss']
})
export class NewTestComponent implements OnInit {

  @Input() newTest!: NewTest | Test;
  @Input() savedTestPreview?: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  

}
