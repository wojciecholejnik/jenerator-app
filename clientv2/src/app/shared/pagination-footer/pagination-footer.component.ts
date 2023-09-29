import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginationInfo } from '../models';

@Component({
  selector: 'app-pagination-footer',
  templateUrl: './pagination-footer.component.html',
  styleUrls: ['./pagination-footer.component.scss']
})
export class PaginationFooterComponent implements OnInit {

  @Input() paginationInfo!: PaginationInfo
  @Output() onChangeRange: EventEmitter<'asc' | 'desc' | 'reset'> = new EventEmitter<'asc' | 'desc' | 'reset'>()

  constructor() { }

  ngOnInit(): void {
  }

  changeRange(direction: 'asc' | 'desc' | 'reset') {
    this.onChangeRange.next(direction)
  }

}
