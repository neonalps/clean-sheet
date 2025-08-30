import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { ChipGroupComponent, ChipGroupInput } from '@src/app/component/chip-group/chip-group.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { PlayerCompetitionItem } from '@src/app/model/dashboard';
import { PersonId } from '@src/app/util/domain-types';

@Component({
  selector: 'app-player-ranking',
  imports: [CommonModule, ChipGroupComponent, PlayerIconComponent],
  templateUrl: './player-ranking.component.html',
  styleUrl: './player-ranking.component.css'
})
export class PlayerRankingComponent implements OnInit, OnDestroy {

  readonly isLoading = signal(true);
  readonly rankingElements = signal<PlayerCompetitionItem[]>([]);

  readonly competitionChipsVisible = signal(false);

  @Input() ranking!: Observable<PlayerCompetitionItem[]>;
  @Input() loading!: Observable<boolean>;
  @Input() competitionChips$!: Observable<ChipGroupInput>;
  @Input() skeletonRowCount = 5;

  @Output() onCompetitionFilterChanged = new EventEmitter<string>();
  @Output() onPlayerSelected = new EventEmitter<PersonId>();

  readonly skeletonRows = [...Array(this.skeletonRowCount).keys()];

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loading.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.isLoading.set(value);
    });

    this.ranking.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.rankingElements.set(value);
      this.isLoading.set(false);
    });

    this.competitionChips$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.competitionChipsVisible.set(true);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCompetitionFilterUpdated(value: string | number | boolean) {
    this.onCompetitionFilterChanged.next(value as string);
  }

  onPlayerClicked(personId: PersonId) {
    this.onPlayerSelected.next(personId);
  }

}
