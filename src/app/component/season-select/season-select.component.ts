import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Season } from '@src/app/model/season';
import { Observable, Subscription } from 'rxjs';
import { OptionId } from '@src/app/component/select/option';

@Component({
  selector: 'app-season-select',
  imports: [SelectComponent],
  templateUrl: './season-select.component.html',
  styleUrl: './season-select.component.css'
})
export class SeasonSelectComponent implements OnInit, OnDestroy {

  @Input() seasons!: Observable<Season[]>;
  @Input() selectedSeasonId?: number;
  @Output() onSelected = new EventEmitter<OptionId>();

  private selectedSeasonIdx = 0;
  private seasonsCopy: Array<Season> = [];
  private subscriptions: Array<Subscription> = [];

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

}
