import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { BasicGame, Tendency } from '@src/app/model/game';
import { Subject } from 'rxjs';
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
import { Chip } from '@src/app/component/chip/chip.component';
import { ScrollNearEndDirective } from '@src/app/directive/scroll-near-end/scroll-near-end.directive';
import { CollapsibleComponent } from "@src/app/component/collapsible/collapsible.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { FilterIconComponent } from "@src/app/icon/filter/filter.component";
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-filterable-game-list',
  imports: [CommonModule, I18nPipe, GameOverviewComponent, ChipGroupComponent, GameRecordComponent, ScrollNearEndDirective, CollapsibleComponent, FilterIconComponent],
  templateUrl: './filterable-game-list.component.html',
  styleUrl: './filterable-game-list.component.css'
})
export class FilterableGameListComponent implements OnInit {

  readonly games = input<BasicGame[]>([]);

  readonly colorLight = COLOR_LIGHT;

  readonly competitionFiltersVisible = signal(false);
  readonly hasActiveFilters = signal(false);
  readonly homeAwayFiltersVisible = signal(false);
  readonly tendencyFiltersVisible = signal(false);

  readonly mainClub: SmallClub = environment.mainClub;
  readonly gameRecord = signal<GameRecord>({ w: 0, d: 0, l: 0 });
  readonly competitionChips = signal<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly homeAwayChips = signal<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly tendencyChips = signal<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly visibleGames = signal<BasicGame[]>([]);

  readonly toggle$ = new Subject<void>();

  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  private readonly currentActivePage = signal(1);
  private readonly currentCompetitionFilters = signal<CompetitionId[]>([]);
  private readonly currentHomeAwayFilters = signal<HomeAwayFilter[]>([]);
  private readonly currentTendencyFilters = signal<Tendency[]>([]);
  
  private readonly isCurrentlyLoadingMore = signal(false);
  private readonly isLoadingMoreAvailable = signal(false);

  private readonly gamesPageSize = 20;

  ngOnInit(): void {
    const storedGames = [...this.games()];

    const seenCompetitions = storedGames.reduce((acc, current) => {
      const effectiveCompetition = this.getEffectiveCompetition(current);

      if (!acc.has(effectiveCompetition.id)) {
        acc.set(effectiveCompetition.id, effectiveCompetition);
      }
      return acc;
    }, new Map<CompetitionId, SmallCompetition>());

    const seenCompetitionIds = Array.from(seenCompetitions.keys());
    
    if (seenCompetitionIds.length > 1) {
      this.competitionChips.set({
        mode: 'single',
        chips: [
          { displayText: this.translationService.translate('competitions.all'), value: 'all', selected: true, },
          ...seenCompetitionIds.map(competitionId => {
            const competition = seenCompetitions.get(competitionId);
            return { displayText: competition!.shortName, value: competitionId, selected: false };
          }),
        ],
        dynamicClassNamesChip: ['text-xs'],
      });
      this.competitionFiltersVisible.set(true);
    } else {
      this.competitionFiltersVisible.set(false);
    }

    const hasAwayGame = storedGames.some(game => game.isHomeGame === false);
    const hasHomeGame = storedGames.some(game => game.isHomeGame === true);
    const hasNeutralGroundGame = storedGames.some(game => game.isNeutralGround === true);
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

      this.homeAwayChips.set({
          mode: 'single',
          chips: [
            { displayText: this.translationService.translate('games.all'), value: 'all', selected: true, },
            ...homeAwayChips,
          ],
          dynamicClassNamesChip: ['text-xs'],
      });

      this.homeAwayFiltersVisible.set(true);
    } else {
      this.homeAwayFiltersVisible.set(false);
    }

    const hasWin = storedGames.some(game => game.resultTendency === 'w');
    const hasDraw = storedGames.some(game => game.resultTendency === 'd');
    const hasLoss = storedGames.some(game => game.resultTendency === 'l');
    if ([hasWin, hasDraw, hasLoss].filter(condition => condition === true).length > 1) {
      const tendencyChips: Chip[] = [];
      if (hasWin) {
        tendencyChips.push({
          displayText: this.translationService.translate('tendency.win'),
          value: 'w',
          selected: false,
        });
      }

      if (hasDraw) {
        tendencyChips.push({
          displayText: this.translationService.translate('tendency.draw'),
          value: 'd',
          selected: false,
        });
      }

      if (hasLoss) {
        tendencyChips.push({
          displayText: this.translationService.translate('tendency.loss'),
          value: 'l',
          selected: false,
        });
      }

      this.tendencyChips.set({
          mode: 'single',
          chips: [
            { displayText: this.translationService.translate('tendency.all'), value: 'all', selected: true, },
            ...tendencyChips,
          ],
          dynamicClassNamesChip: ['text-xs'],
      });

      this.tendencyFiltersVisible.set(true);
    } else {
      this.tendencyFiltersVisible.set(false);
    }

    if (storedGames.length > this.gamesPageSize) {
      this.isLoadingMoreAvailable.set(true);
    }

    this.updateUi();
  }

  onCompetitionFilterChanged(value: string | number | boolean) {
    this.currentCompetitionFilters.set(value === 'all' ? [] : [value as CompetitionId]);
    this.updateUi();
  }

  onHomeAwayFilterChanged(value: string | number | boolean) {
    this.currentHomeAwayFilters.set(value === 'all' ? [] : [value as HomeAwayFilter]);
    this.updateUi();
  }

  onTendencyFilterChanged(value: string | number | boolean) {
    this.currentTendencyFilters.set(value === 'all' ? [] : [value as Tendency]);
    this.updateUi();
  }

  onNearEndScroll() {
    if (this.isLoadingMoreAvailable() && !this.isCurrentlyLoadingMore()) {
      this.isCurrentlyLoadingMore.set(true);

      this.currentActivePage.update(current => current + 1);
      this.updateUi();
      this.isCurrentlyLoadingMore.set(false);
    }
  }

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

  triggerToggle() {
    this.toggle$.next();
  }

  private updateUi() {
    const storedGames = [...this.games()];

    const currentCompetitionFiltersValue = this.currentCompetitionFilters();
    const currentHomeAwayFiltersValue = this.currentHomeAwayFilters();
    const currentTendencyFiltersValue = this.currentTendencyFilters();

    // determine visible games
    const visibleGames = storedGames
      .filter(game => {
        const effectiveCompetition = this.getEffectiveCompetition(game);
        return currentCompetitionFiltersValue.length === 0 || currentCompetitionFiltersValue.includes(effectiveCompetition.id);
      })
      .filter(game => {
        if (currentHomeAwayFiltersValue.includes('neutral')) {
          return game.isNeutralGround === true;
        }

        if (currentHomeAwayFiltersValue.includes('away')) {
          return game.isHomeGame === false && game.isNeutralGround !== true;
        }

        if (currentHomeAwayFiltersValue.includes('home')) {
          return game.isHomeGame === true && game.isNeutralGround !== true;
        }

        return true;
      })
      .filter(game => {
        return currentTendencyFiltersValue.length > 0 ? game.resultTendency === currentTendencyFiltersValue[0] : true;
      });

    this.hasActiveFilters.set(visibleGames.length !== storedGames.length);

    // determine and publish new game record
    this.gameRecord.set(visibleGames.reduce((acc: GameRecord, current: BasicGame): GameRecord => {
        return {
          w: acc.w + (current.resultTendency === 'w' ? 1 : 0),
          d: acc.d + (current.resultTendency === 'd' ? 1 : 0),
          l: acc.l + (current.resultTendency === 'l' ? 1 : 0),
        };
      }, { w: 0, d: 0, l: 0 }));

    // publish visible games
    const updatedVisibleGamesSize = this.currentActivePage() * this.gamesPageSize;
    this.visibleGames.set(visibleGames.slice(0, updatedVisibleGamesSize));

    this.isLoadingMoreAvailable.set(updatedVisibleGamesSize < storedGames.length);
  }

  private getEffectiveCompetition(game: BasicGame): SmallCompetition {
    return game.competition.parent ?? game.competition;
  }

}
