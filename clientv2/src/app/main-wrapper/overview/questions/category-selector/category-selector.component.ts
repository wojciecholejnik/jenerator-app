import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/models';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {

  @Input() categories!: Category[];

  constructor() { }

  ngOnInit(): void {
  }

}
