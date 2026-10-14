import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { assertUnreachable } from '@src/app/util/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

export type ButtonType = 'success' | 'danger' | 'secondary' | 'action' | 'ghost' | 'info';

@Component({
  selector: 'app-button',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  readonly buttonType = input.required<ButtonType>();
  readonly icon = input<UiIconDescriptor>();
  readonly iconRight = input<UiIconDescriptor>();
  readonly text = input<string>();
  readonly textClasses = input<string>();
  
  readonly enabled = input<boolean>(true);
  readonly iconOnly = input(false);

  readonly onClicked = output<void>();

  readonly dynamicClasses = computed(() => {
    const buttonType = this.buttonType();

    const dynamic: string[] = [];

    switch (buttonType) {
      case 'success':
        dynamic.push('button-success');
        break;
      case 'danger':
        dynamic.push('button-danger');
        break;
      case 'secondary':
        dynamic.push('button-secondary');
        break;
      case 'action':
        dynamic.push('button-action');
        break;
      case 'ghost':
        dynamic.push('button-ghost');
        break;
      case 'info':
        dynamic.push('button-info');
        break;
      default:
        assertUnreachable(buttonType);
    }

    if (!this.enabled()) {
      dynamic.push('button-disabled');
    }

    if (!this.iconOnly()) {
      dynamic.push('min-w-160');
    }

    return dynamic;
  });

  onClick() {
    this.onClicked.emit();
  }

}
