import { Component, input, output, signal } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";
import { UiIconDescriptor } from '@src/app/model/icon';
import { COLOR_DANGER_LIGHTER_40 } from '@src/styles/constants';

export type ContextMenuSection = {
  title?: string;
  items: ContextMenuItem[];
}

export type ContextMenuItem = {
  id: string;
  iconDescriptor?: UiIconDescriptor;
  text: string;
  isDanger?: boolean;
}

@Component({
  selector: 'app-context-menu',
  imports: [CommonModule, UiIconComponent, ClickOutsideDirective],
  templateUrl: './context-menu.component.html'
})
export class ContextMenuComponent {

  readonly menuSections = input.required<ContextMenuSection[]>();

  readonly onMenuItemSelected = output<string>();

  readonly colorDanger = COLOR_DANGER_LIGHTER_40;

  readonly isOpen = signal(false);

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  itemSelected(itemId: string) {
    this.onMenuItemSelected.emit(itemId);
    this.close();
  }

}
