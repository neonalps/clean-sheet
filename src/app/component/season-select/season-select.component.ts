import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Season } from '@src/app/model/season';
import { Observable, Subject, Subscription } from 'rxjs';
import { OptionId } from '@src/app/component/select/option';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-season-select',
  imports: [CommonModule, SelectComponent],
  templateUrl: './season-select.component.html',
  styleUrl: './season-select.component.css'
})
export class SeasonSelectComponent implements OnInit, OnDestroy {

  @Input() seasons!: Observable<Season[]>;
  @Input() selectedSeasonId?: number;
  @Output() onSelected = new EventEmitter<OptionId>();

  hasBefore = false;
  hasNext = false;

  private selectedSeasonIdx: number | undefined;
  private seasonsCopy: Array<Season> = [];
  private subscriptions: Array<Subscription> = [];

  beforeSubject = new Subject<boolean>();
  nextSubject = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const seasonsCopySubscription = this.seasons.subscribe(seasons => this.seasonsCopy = seasons);
    this.subscriptions.push(seasonsCopySubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onSeasonSelected(selectedSeasonId: OptionId): void {
    this.selectedSeasonIdx = this.seasonsCopy.findIndex(item => item.id === selectedSeasonId);
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
