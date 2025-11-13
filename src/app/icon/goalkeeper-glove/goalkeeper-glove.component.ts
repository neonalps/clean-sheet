import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-goalkeeper-glove',
  imports: [],
  templateUrl: './goalkeeper-glove.component.html',
  styleUrl: './goalkeeper-glove.component.css'
})
export class GoalkeeperGloveComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
