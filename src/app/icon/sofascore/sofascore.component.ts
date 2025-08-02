import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-sofascore',
  imports: [],
  templateUrl: './sofascore.component.html',
  styleUrl: './sofascore.component.css'
})
export class SofascoreComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
