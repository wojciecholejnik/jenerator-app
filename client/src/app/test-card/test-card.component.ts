import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-test-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss']
})
export class TestCardComponent implements OnInit {
  @Input('questions') questions: any;
  @Input('category') category: any;
  composer = sessionStorage.getItem('shortName');
  emoticon = sessionStorage.getItem('emoticon');

  constructor() { }

  ngOnInit(): void {
  }

}
