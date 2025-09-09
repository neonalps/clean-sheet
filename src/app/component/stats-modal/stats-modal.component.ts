import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from "@src/app/component/modal/modal.component";
import { GamesPlayedService, GetPlayerGamesPlayedResponse } from '@src/app/module/games-played/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { groupBy } from '@src/app/util/array';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { BasicGame, GameStatus, ScoreTuple } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { PersonId } from '@src/app/util/domain-types';
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { ModalService } from '@src/app/module/modal/service';
import { environment } from "@src/environments/environment";
import { ScoreFormatter } from '@src/app/module/game/score-formatter';

export type StatsModalPayload = {
  personId: PersonId;
  filterOptions?: GamePlayedFilterOptions;
};

type SeasonGamesPlayed = {
  seasonName: string;
  gamesPlayed: GetPlayerGamesPlayedResponse[];
}

@Component({
  selector: 'app-stats-modal',
  imports: [CommonModule, I18nPipe, ModalComponent, UiIconComponent],
  templateUrl: './stats-modal.component.html',
  styleUrl: './stats-modal.component.css'
})
export class StatsModalComponent implements OnInit, OnDestroy {

  groupedGamesPlayed: SeasonGamesPlayed[] = [];

  groupedGamesPlayed$ = new BehaviorSubject<SeasonGamesPlayed[]>([]);
  isLoading = signal(true);

  private readonly gamesPlayedService = inject(GamesPlayedService);
  private readonly modalService = inject(ModalService);
  private readonly scoreFormatter = inject(ScoreFormatter);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.statsModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.loadGamesPlayed(payload.personId, payload.filterOptions);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadGamesPlayed(personId: PersonId, filterOptions?: GamePlayedFilterOptions) {
    this.isLoading.set(true);
    this.gamesPlayedService.getForPlayer(personId, filterOptions).pipe(takeUntil(this.destroy$)).subscribe({
      next: (value) => {
        console.log(value);
        const groupedResponse = groupBy(value.items, item => item.game.season.name);
        
        for (const seasonName of groupedResponse.keys()) {
          const existing = this.groupedGamesPlayed.find(item => item.seasonName === seasonName);
          if (existing) {
            existing.gamesPlayed.push(...(groupedResponse.get(seasonName) || []));
          } else {
            this.groupedGamesPlayed.push({
              seasonName: seasonName,
              gamesPlayed: groupedResponse.get(seasonName) || [],
            });
          }
        }

        this.groupedGamesPlayed$.next(this.groupedGamesPlayed);

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  getResult(score: ScoreTuple | null): string {
      return this.scoreFormatter.format(score);
    }
  
  getGameScoreBeforePso(game: BasicGame) {
    if (game.status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(getGameResult(game, false));
  }

  getGameScoreAfterPso(game: BasicGame) {
    return this.getResult(getGameResult(game, true));
  }

  getResultTendencyClass(game: BasicGame): string {
    return `result-tendency-${game.resultTendency}`;
  }

  getNumberArray(goalsScored?: number): number[] {
    return [...Array(goalsScored ?? 0).keys()];
  }

  getMultipleIconPositionModifiers(idx: number, total: number): string[] {
    if (total === 0) {
      return [];
    }

    const modifiers: string[] = [];

    if (idx > 0) {
      modifiers.push(`left-neg-${idx * 8}`);
    }

    if ((idx + 1) === total) {
      modifiers.push(`mr-2`);
    }

    return modifiers;
  }

  onGameClicked(game: BasicGame) {
    window.open(`${environment.frontendBaseUrl}/game/${game.id}`, '_blank');
  }

}
