import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-playing-football',
  imports: [],
  templateUrl: './playing-football.component.html',
  styleUrl: './playing-football.component.css'
})
export class PlayingFootballComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
