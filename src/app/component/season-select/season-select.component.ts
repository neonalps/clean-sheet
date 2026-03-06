import { Component, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Season } from '@src/app/model/season';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { CommonModule } from '@angular/common';
import { ChevronRightComponent } from '@src/app/icon/chevron-right/chevron-right.component';
import { ChevronLeftComponent } from '@src/app/icon/chevron-left/chevron-left.component';
import { SeasonId } from '@src/app/util/domain-types';

@Component({
  selector: 'app-season-select',
  imports: [CommonModule, ChevronRightComponent, SelectComponent, ChevronLeftComponent],
  templateUrl: './season-select.component.html',
  styleUrl: './season-select.component.css'
})
export class SeasonSelectComponent implements OnInit, OnDestroy {

  readonly seasons = input.required<Observable<Season[]>>();
  readonly selectedSeason$ = input<BehaviorSubject<SelectOption | null>>();
  readonly onSelected = output<OptionId>();

  readonly hasBefore = signal(false);
  readonly hasNext = signal(false);

  private readonly currentSeasonsValue = signal<Season[]>([]);
  private readonly currentSelectedSeasonId = signal<SeasonId | null>(null);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.seasons()?.pipe(
      takeUntil(this.destroy$),
    ).subscribe(seasonsValue => {
      this.currentSeasonsValue.set(seasonsValue);
    });

    this.selectedSeason$()?.pipe(
      takeUntil(this.destroy$),
    ).subscribe(selectedSeasonValue => {
      if (selectedSeasonValue === null) {
        this.hasBefore.set(false);
        this.hasNext.set(false);
        return;
      }

      const currentSelectedSeasonId = Number(selectedSeasonValue.id);
      this.currentSelectedSeasonId.set(currentSelectedSeasonId);

      const currentSeasons = this.currentSeasonsValue();
      const currentSeasonValueIndex = currentSeasons.findIndex(item => item.id === currentSelectedSeasonId);
      // the seasons are ordered descendingly
      this.hasBefore.set(currentSeasonValueIndex < (currentSeasons.length - 1));
      this.hasNext.set(currentSeasonValueIndex > 0);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSeasonSelected(option: SelectOption): void {
    this.onSelected.emit(option.id);
  }

  onBeforeClicked(): void {
    this.moveSeasonIndex(1);
  }

  onNextClicked(): void {
    this.moveSeasonIndex(-1);
  }

  private moveSeasonIndex(moveBy: number) {
    const currentId = this.currentSelectedSeasonId();
    if (currentId === null) {
      return;
    }

    const currentSeasons = this.currentSeasonsValue();
    const currentSeasonValueIndex = currentSeasons.findIndex(item => item.id === currentId);

    const newSeasonValue = currentSeasons[currentSeasonValueIndex + moveBy];
    this.onSeasonSelected(newSeasonValue);
  }


}
