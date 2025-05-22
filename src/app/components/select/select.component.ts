import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { OptionProvider } from './provider';
import { OptionId, SelectOption } from './option';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';
import { ClickOutsideDirective } from '@src/app/directives/click-outside/click-outside.directive';
import { ChevronDownComponent } from '@src/app/icon/chevron-down/chevron-down.component';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-select',
  imports: [ChevronDownComponent, CommonModule, ClickOutsideDirective],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {

  colorLight = COLOR_LIGHT;
  isOpen = signal(false);

  private selected: SelectOption | null = null;

  @Input() emptyText!: string;
  @Input() optionProvider!: OptionProvider;
  @Input() options$!: Observable<SelectOption[]>;
  @Input() showSearch: boolean = false;
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelected = new EventEmitter<OptionId>();

  getDisplayText(): string {
    return this.selected === null ? this.emptyText : this.selected.name;
  }

  onSearchChange(event: Event): void {
    this.onSearch.next(getHtmlInputElementFromEvent(event).value);
  }

  onSelect(selectedOption: SelectOption): void {
    if (this.selected?.id === selectedOption.id) {
      return;
    }

    this.selected = selectedOption;
    this.onSelected.next(this.selected.id);
    this.toggleDropdown();
  }

  hideDropdown() {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  isSelected(option: SelectOption): boolean {
    return this.selected?.id === option.id;
  }

  handleOutsideClick() {
    this.hideDropdown();
  }

}
