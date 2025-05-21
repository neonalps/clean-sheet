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

  private selected: OptionId | null = null;

  @Input() emptyText!: string;
  @Input() optionProvider!: OptionProvider;
  @Input() options$!: Observable<SelectOption[]>;
  @Input() showSearch: boolean = false;
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelected = new EventEmitter<OptionId>();

  getEmptyText(): string {
    return this.emptyText;
  }

  onSearchChange(event: Event): void {
    this.onSearch.next(getHtmlInputElementFromEvent(event).value);
  }

  onSelect(selectedOptionId: OptionId): void {
    if (this.selected === selectedOptionId) {
      return;
    }

    this.selected = selectedOptionId;
    this.onSelected.next(selectedOptionId);
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

}
