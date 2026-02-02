import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-coffin',
  imports: [],
  templateUrl: './coffin.component.html',
  styleUrl: './coffin.component.css'
})
export class CoffinComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
