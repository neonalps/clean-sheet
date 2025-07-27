import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-competition-table',
  imports: [],
  templateUrl: './competition-table.component.html',
  styleUrl: './competition-table.component.css'
})
export class CompetitionTableComponent {
  
  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
