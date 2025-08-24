import { Component, signal } from '@angular/core';
import { UiIconComponent } from "../ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";

@Component({
  selector: 'app-context-menu',
  imports: [CommonModule, UiIconComponent, ClickOutsideDirective],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent {

  readonly isOpen = signal(false);

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  itemClicked() {
    this.close();
  }

}
