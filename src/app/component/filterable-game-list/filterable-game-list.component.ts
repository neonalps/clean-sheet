import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { BasicGame } from '@src/app/model/game';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { GameOverviewComponent } from "@src/app/component/game-overview/game-overview.component";
import { ChipGroupComponent, ChipGroupInput } from "@src/app/component/chip-group/chip-group.component";
import { GameRecord, GameRecordComponent } from "@src/app/component/game-record/game-record.component";
import { navigateToGameWithoutDetails } from '@src/app/util/router';
import { Router } from '@angular/router';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { CompetitionId } from '@src/app/util/domain-types';
import { HomeAwayFilter } from '@src/app/util/filter';
import { SmallCompetition } from '@src/app/model/competition';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { Chip } from '../chip/chip.component';

@Component({
  selector: 'app-filterable-game-list',
  imports: [CommonModule, GameOverviewComponent, ChipGroupComponent, GameRecordComponent],
  templateUrl: './filterable-game-list.component.html',
  styleUrl: './filterable-game-list.component.css'
})
export class FilterableGameListComponent implements OnInit, OnDestroy {

  @Input() games$!: Observable<BasicGame[]>;

  competitionFiltersVisible = signal(false);
  homeAwayFiltersVisible = signal(false);

  readonly mainClub: SmallClub = environment.mainClub;
  readonly gameRecord$ = new BehaviorSubject<GameRecord>({ w: 0, d: 0, l: 0 });
  readonly competitionChips$ = new BehaviorSubject<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly homeAwayChips$ = new BehaviorSubject<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly visibleGames$ = new BehaviorSubject<BasicGame[]>([]);

  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  private storedGames: BasicGame[] = [];
  private currentActivePage = 1;
  private currentCompetitionFilters: CompetitionId[] = [];
  private currentHomeAwayFilters: HomeAwayFilter[] = [];
  
  private isCurrentlyLoadingMore = false;
  private isLoadingMoreAvailable = false;

  private readonly destroy$ = new Subject<void>();
  private readonly gamesPageSize = 20;

  ngOnInit(): void {
    this.games$.pipe(takeUntil(this.destroy$)).subscribe(games => {
      this.storedGames = games;

      const seenCompetitions = this.storedGames.reduce((acc, current) => {
        const effectiveCompetition = this.getEffectiveCompetition(current);

        if (!acc.has(effectiveCompetition.id)) {
          acc.set(effectiveCompetition.id, effectiveCompetition);
        }
        return acc;
      }, new Map<CompetitionId, SmallCompetition>());

      const seenCompetitionIds = Array.from(seenCompetitions.keys());
      
      if (seenCompetitionIds.length > 1) {
        this.competitionChips$.next({
          mode: 'single',
          chips: [
            { displayText: this.translationService.translate('competitions.all'), value: 'all', selected: true, },
            ...seenCompetitionIds.map(competitionId => {
              const competition = seenCompetitions.get(competitionId);
              return { displayText: competition!.shortName, value: competitionId, selected: false };
            }),
          ],
        });
        this.competitionFiltersVisible.set(true);
      } else {
        this.competitionFiltersVisible.set(false);
      }

      const hasAwayGame = this.storedGames.some(game => game.isHomeGame === false);
      const hasHomeGame = this.storedGames.some(game => game.isHomeGame === true);
      const hasNeutralGroundGame = this.storedGames.some(game => game.isNeutralGround === true);
      if ([hasAwayGame, hasHomeGame, hasNeutralGroundGame].filter(condition => condition === true).length > 1) {
        const homeAwayChips: Chip[] = [];
        if (hasHomeGame) {
          homeAwayChips.push({
            displayText: this.translationService.translate('game.home'),
            value: 'home',
            selected: false,
          });
        }

        if (hasAwayGame) {
          homeAwayChips.push({
            displayText: this.translationService.translate('game.away'),
            value: 'away',
            selected: false,
          });
        }

        if (hasNeutralGroundGame) {
          homeAwayChips.push({
            displayText: this.translationService.translate('game.neutralGround'),
            value: 'neutral',
            selected: false,
          });
        }

        this.homeAwayChips$.next({
            mode: 'single',
            chips: [
              { displayText: this.translationService.translate('games.all'), value: 'all', selected: true, },
              ...homeAwayChips,
            ],
        });

        this.homeAwayFiltersVisible.set(true);
      } else {
        this.homeAwayFiltersVisible.set(false);
      }

      if (this.storedGames.length > this.gamesPageSize) {
        this.isLoadingMoreAvailable = true;
      }

      this.updateUi();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCompetitionFilterChanged(value: string | number | boolean) {
    this.currentCompetitionFilters = value === 'all' ? [] : [value as CompetitionId];
    this.updateUi();
  }

  onHomeAwayFilterChanged(value: string | number | boolean) {
    this.currentHomeAwayFilters = value === 'all' ? [] : [value as HomeAwayFilter];
    this.updateUi();
  }

  onNearEndScroll() {
    if (this.isLoadingMoreAvailable && !this.isCurrentlyLoadingMore) {
      console.log('starting loading more');
      this.isCurrentlyLoadingMore = true;

      this.currentActivePage += 1;
      this.updateUi();
      console.log('finished loading more');
      this.isCurrentlyLoadingMore = false;
    }
  }

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

  private updateUi() {
    // determine visible games
    const visibleGames = this.storedGames
      .filter(game => {
        const effectiveCompetition = this.getEffectiveCompetition(game);
        return this.currentCompetitionFilters.length === 0 || this.currentCompetitionFilters.includes(effectiveCompetition.id);
      })
      .filter(game => {
        if (this.currentHomeAwayFilters.includes('neutral')) {
          return game.isNeutralGround === true;
        }

        if (this.currentHomeAwayFilters.includes('away')) {
          return game.isHomeGame === false && game.isNeutralGround !== true;
        }

        if (this.currentHomeAwayFilters.includes('home')) {
          return game.isHomeGame === true && game.isNeutralGround !== true;
        }

        return true;
      });

    // determine and publish new game record
    this.gameRecord$.next(visibleGames.reduce((acc: GameRecord, current: BasicGame): GameRecord => {
        return {
          w: acc.w + (current.resultTendency === 'w' ? 1 : 0),
          d: acc.d + (current.resultTendency === 'd' ? 1 : 0),
          l: acc.l + (current.resultTendency === 'l' ? 1 : 0),
        };
      }, { w: 0, d: 0, l: 0 }));

    // publish visible games
    const updatedVisibleGamesSize = this.currentActivePage * this.gamesPageSize;
    this.visibleGames$.next(visibleGames.slice(0, updatedVisibleGamesSize));

    this.isLoadingMoreAvailable = updatedVisibleGamesSize < this.storedGames.length;
  }

  private getEffectiveCompetition(game: BasicGame): SmallCompetition {
    return game.competition.parent ?? game.competition;
  }

}
