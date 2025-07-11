import { CommonModule } from '@angular/common';
import { Component, ElementRef, Output, ViewChild } from '@angular/core';
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

  showPicker() {
    (this.datePickerElement.nativeElement as HTMLInputElement).showPicker();
  }

  onDateSelected(event: Event) {
    console.log(new Date(getHtmlInputElementFromEvent(event).value).toISOString());
  }

}
