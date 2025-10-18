import { Component, Input } from '@angular/core';
import { COLOR_LIGHT, KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-field-with-ball',
  imports: [],
  templateUrl: './field-with-ball.component.html',
  styleUrl: './field-with-ball.component.css'
})
export class FieldWithBallComponent {

  @Input() color?: string;
  
  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
