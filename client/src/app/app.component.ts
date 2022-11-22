import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor (){};

  ngOnInit(): void {
      const background = localStorage.getItem('background');
      if (background) {
        document.body.style.background = background;
      }
  }
}
