import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { OptionProvider } from './provider';
import { OptionId, SelectOption } from './option';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';

@Component({
  selector: 'app-select',
  imports: [CommonModule],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent {

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

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  isSelected(option: SelectOption): boolean {
    return this.selected?.id === option.id;
  }

}
