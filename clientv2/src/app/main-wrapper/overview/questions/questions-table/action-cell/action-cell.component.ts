import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-action-cell',
  templateUrl: './action-cell.component.html',
  styleUrls: ['./action-cell.component.scss']
})
export class ActionCellComponent implements OnInit {

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.isOpen) return
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.closeIsOpen()
    }
  }

  @Input() isNewTest!: boolean;
  @Output() onDetails: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  

  isOpen = false;
  menuElem = document.querySelector('div.menu');
  triggerElem = document.querySelector('i.trigger');

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  setIsOpen(): void {
    this.isOpen = true;
  }

  closeIsOpen(): void {
    this.isOpen = false;
  }

  showDetails(): void {
    this.onDetails.emit();
    this.closeIsOpen()
  }

  editQuestion(): void {
    this.onEdit.emit();
    this.closeIsOpen()
  }

  removeQuestion(): void {
    this.onRemove.emit();
    this.closeIsOpen()
  }

}
