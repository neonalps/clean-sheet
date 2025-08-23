import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-menu-icon-vertical',
  imports: [],
  templateUrl: './menu-vertical.component.html',
  styleUrl: './menu-vertical.component.css'
})
export class MenuIconVerticalComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
