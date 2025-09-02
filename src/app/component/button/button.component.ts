import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { assertUnreachable } from '@src/app/util/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

export type ButtonType = 'success' | 'danger' | 'secondary';

@Component({
  selector: 'app-button',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input() buttonType!: ButtonType;
  @Input() icon?: UiIconDescriptor;
  @Input() iconRight?: UiIconDescriptor;
  @Input() text?: string;

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

    if (!this.enabled()) {
      dynamic.push('button-disabled');
    }

    return dynamic;
  }

}
