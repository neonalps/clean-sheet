import { Component, Input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-drag-handle-icon',
  imports: [],
  templateUrl: './drag-handle.component.html',
})
export class DragHandleIconComponent {

  @Input() color?: string;

  getColor(): string {
    return this.color || KEYWORD_CURRENT_COLOR;
  }

}
