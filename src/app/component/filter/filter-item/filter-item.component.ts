import { Component, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { SelectComponent } from "@src/app/component/select/select.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { Observable, of, Subject } from 'rxjs';
import { SelectOption } from '@src/app/component/select/option';
import { ensureNotNullish, isDefined } from '@src/app/util/common';
import { GenericFilterItem } from '@src/app/module/filter/service';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-item',
  imports: [CommonModule, SelectComponent, I18nPipe, UiIconComponent],
  templateUrl: './filter-item.component.html'
})
export class FilterItemComponent implements OnInit, OnDestroy {

  readonly filterItem = input.required<GenericFilterItem>();
  readonly availableFilterTypeOptions = input.required<SelectOption[]>();
  readonly removable = input(true);

  readonly onFilterItemChanged = output<GenericFilterItem>();
  readonly onFilterItemRemoved = output<GenericFilterItem>();

  readonly pushSelectedFilterType$ = new Subject<SelectOption>();

  private readonly currentFilterItemId = signal<string | null>(null);
  private readonly currentFilterItemType = signal<string | null>(null);
  private readonly currentFilterItemValue = signal<unknown>(null);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const filterItemInput = this.filterItem();

    this.currentFilterItemId.set(filterItemInput.id);
    this.currentFilterItemType.set(filterItemInput.type);
    this.currentFilterItemValue.set(filterItemInput.value);

    const availableOptions = this.availableFilterTypeOptions();

    if (isDefined(filterItemInput.type)) {
      const selectedValue = ensureNotNullish(availableOptions.find(option => option.id === filterItemInput.type));
      setTimeout(() => this.pushSelectedFilterType$.next(selectedValue), 0);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilterTypeOptions(): Observable<SelectOption[]> {
    return of(this.availableFilterTypeOptions());
  }

  onFilterTypeSelected(option: SelectOption) {
    this.currentFilterItemType.set(typeof option.id === 'string' ? option.id : option.id.toString());
    this.currentFilterItemValue.set({});
    this.emitValue();
  }

  removeItem() {
    this.onFilterItemRemoved.emit(this.getCurrentValue());
  }

  private emitValue() {
    this.onFilterItemChanged.emit(this.getCurrentValue());
  }

  private getCurrentValue(): GenericFilterItem {
    return {
      id: ensureNotNullish(this.currentFilterItemId()),
      type: this.currentFilterItemType(),
      value: this.currentFilterItemValue(),
    }
  }

}
