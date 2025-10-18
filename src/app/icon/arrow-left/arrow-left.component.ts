import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-arrow-left',
  imports: [],
  templateUrl: './arrow-left.component.html',
  styleUrl: './arrow-left.component.css'
})
export class ArrowLeftComponent {

  @Input() color?: string;
  
  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
