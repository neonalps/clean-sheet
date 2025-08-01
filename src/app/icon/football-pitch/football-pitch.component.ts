import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-football-pitch',
  imports: [],
  templateUrl: './football-pitch.component.html',
  styleUrl: './football-pitch.component.css'
})
export class FootballPitchComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
