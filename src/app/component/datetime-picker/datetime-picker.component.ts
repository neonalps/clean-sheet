import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { CalendarIconComponent } from '@src/app/icon/calendar-icon/calendar-icon.component';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';
import { getLocalDateTimeString } from '@src/app/util/date';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-datetime-picker',
  imports: [CalendarIconComponent, CommonModule],
  templateUrl: './datetime-picker.component.html',
  styleUrl: './datetime-picker.component.css'
})
export class DatetimePickerComponent implements OnInit, OnDestroy {

  @ViewChild('picker', { static: false }) datePickerElement!: ElementRef;

  readonly input = input<Observable<Date | undefined>>();
  readonly onDateSelected = output<Date | undefined>();

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.input()?.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.datePickerElement.nativeElement.value = value ? getLocalDateTimeString(value) : undefined;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showPicker() {
    (this.datePickerElement.nativeElement as HTMLInputElement).showPicker();
  }

  onSelected(event: Event) {
    const inputValue = getHtmlInputElementFromEvent(event).value;
    this.onDateSelected.emit(inputValue.trim().length > 0 ? new Date(inputValue) : undefined);
  }

}
