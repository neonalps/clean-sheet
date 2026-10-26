import { Component, computed, ElementRef, input, output, viewChild } from '@angular/core';
import { isNotDefined } from '@src/app/util/common';
import { DateString } from '@src/app/util/domain-types';
import { Nullish } from '@src/app/util/types';

@Component({
  selector: 'app-date-picker',
  imports: [],
  templateUrl: './date-picker.component.html'
})
export class DatePickerComponent {

  readonly datePickerElement = viewChild.required<ElementRef<HTMLInputElement>>('picker');

  readonly date = input.required<Nullish<DateString>>();

  readonly pickerValue = computed(() => {
    const dateValue = this.date();
    if (isNotDefined(dateValue)) {
      return undefined;
    }

    return dateValue.length > 10 ? dateValue.substring(0, 10) : dateValue;
  })

  readonly onValueChange = output<string | undefined>();

  onDateChange(): void {
    this.onValueChange.emit(this.datePickerElement().nativeElement.value);
  }

}
