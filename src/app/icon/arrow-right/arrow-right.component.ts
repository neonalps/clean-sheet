import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-arrow-right',
  imports: [],
  templateUrl: './arrow-right.component.html',
  styleUrl: './arrow-right.component.css'
})
export class ArrowRightComponent {

  @Input() color?: string;
    
  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
