import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CalendarIconComponent } from '@src/app/icon/calendar-icon/calendar-icon.component';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';

@Component({
  selector: 'app-datetime-picker',
  imports: [CalendarIconComponent, CommonModule],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.css'
})
export class DatetimePickerComponent {

  @ViewChild('picker', { static: false }) datePickerElement!: ElementRef;

  @Output() onDateSelected = new EventEmitter<Date | undefined>();

  showPicker() {
    (this.datePickerElement.nativeElement as HTMLInputElement).showPicker();
  }

  onSelected(event: Event) {
    const inputValue = getHtmlInputElementFromEvent(event).value;
    this.onDateSelected.next(inputValue.trim().length > 0 ? new Date(inputValue) : undefined);
  }

}
