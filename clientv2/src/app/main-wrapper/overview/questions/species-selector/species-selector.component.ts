import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { QuestionSpecies } from 'src/app/shared/models';

@Component({
  selector: 'app-species-selector',
  templateUrl: './species-selector.component.html',
  styleUrls: ['./species-selector.component.scss']
})
export class SpeciesSelectorComponent implements OnInit {
  @Output() onSpeciesSelect: EventEmitter<QuestionSpecies | undefined> = new EventEmitter();
  @Input() questionSpecies: QuestionSpecies | undefined = undefined;
  selectedSpecies: QuestionSpecies | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
    this.selectedSpecies = this.questionSpecies;
  }

  selectSpecies(species: QuestionSpecies): void {
    this.selectedSpecies = species;
    this.onSpeciesSelect.emit(this.selectedSpecies);
  }
}