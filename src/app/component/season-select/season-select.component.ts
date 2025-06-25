import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Season } from '@src/app/model/season';
import { Observable, Subject, Subscription } from 'rxjs';
import { OptionId } from '@src/app/component/select/option';
import { CommonModule } from '@angular/common';
import { ChevronLeftComponent } from "@src/app/icon/chevron-left/chevron-left.component";
import { ChevronRightComponent } from '@src/app/icon/chevron-right/chevron-right.component';

@Component({
  selector: 'app-season-select',
  imports: [CommonModule, ChevronLeftComponent, ChevronRightComponent, SelectComponent],
  templateUrl: './season-select.component.html',
  styleUrl: './season-select.component.css'
})
export class SeasonSelectComponent implements OnDestroy {

  @Input() seasons!: Observable<Season[]>;
  @Input() selectedSeasonId!: Observable<number>;
  @Output() onSelected = new EventEmitter<OptionId>();

  hasBefore = false;
  hasNext = false;

  private subscriptions: Array<Subscription> = [];

  beforeSubject = new Subject<boolean>();
  nextSubject = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSeasonSelected(selectedSeasonId: OptionId): void {
    this.onSelected.emit(selectedSeasonId);
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
