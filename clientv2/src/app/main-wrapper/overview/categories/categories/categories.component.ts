import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/models';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  addModalIsOpen = false;

  @Input() categories!: Category[];

  constructor() { }

  ngOnInit(): void {
  }

  openAddModal(): void {
    this.addModalIsOpen = true;
  }

  closeAddModal(): void {
    this.addModalIsOpen = false;
  }

}
