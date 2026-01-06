import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Season } from '@src/app/model/season';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { CommonModule } from '@angular/common';
import { ChevronRightComponent } from '@src/app/icon/chevron-right/chevron-right.component';
import { ChevronLeftComponent } from '@src/app/icon/chevron-left/chevron-left.component';

@Component({
  selector: 'app-season-select',
  imports: [CommonModule, ChevronRightComponent, SelectComponent, ChevronLeftComponent],
  templateUrl: './season-select.component.html',
  styleUrl: './season-select.component.css'
})
export class SeasonSelectComponent {

  @Input() seasons!: Observable<Season[]>;
  @Input() selectedSeason$!: BehaviorSubject<SelectOption | null>;
  @Output() onSelected = new EventEmitter<OptionId>();

  hasBefore = false;
  hasNext = false;

  beforeSubject = new Subject<boolean>();
  nextSubject = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  onSeasonSelected(option: SelectOption): void {
    this.onSelected.emit(option.id);
  }

  onHasBefore(hasBefore: boolean): void {
    this.hasBefore = hasBefore;
    this.cdr.detectChanges();
  }

  onHasNext(hasNext: boolean): void {
    this.hasNext = hasNext;
    this.cdr.detectChanges();
  }

  onBeforeClicked(): void {
    this.beforeSubject.next(true);
  }

  onNextClicked(): void {
    this.nextSubject.next(true);
  }

}
