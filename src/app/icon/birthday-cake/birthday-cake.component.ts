import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-birthday-cake',
  imports: [],
  templateUrl: './birthday-cake.component.html',
  styleUrl: './birthday-cake.component.css'
})
export class BirthdayCakeComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
