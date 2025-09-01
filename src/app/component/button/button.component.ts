import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output, signal } from '@angular/core';
import { assertUnreachable } from '@src/app/util/common';

export type ButtonType = 'success' | 'danger' | 'secondary';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input() buttonType!: ButtonType;

  @Output() onClicked = new EventEmitter<void>();

  enabled = input<boolean>(true);

  onClick() {
    this.onClicked.next();
  }

  getDynamicClasses(): string[] {
    const dynamic: string[] = [];

    switch (this.buttonType) {
      case 'success':
        dynamic.push('button-success');
        break;
      case 'danger':
        dynamic.push('button-danger');
        break;
      case 'secondary':
        dynamic.push('button-secondary');
        break;
      default:
        assertUnreachable(this.buttonType);
    }

    return dynamic;
  }

}
