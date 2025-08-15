import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClubResolver } from '@src/app/module/club/resolver';
import { isDefined } from '@src/app/util/common';
import { ClubId, CompetitionId } from '@src/app/util/domain-types';
import { navigateToGameWithoutDetails, PATH_PARAM_CLUB_ID } from '@src/app/util/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { GetClubByIdResponse } from '@src/app/module/club/service';
import { ExternalLinksComponent } from '@src/app/component/external-links/external-links.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ChipGroupComponent, ChipGroupInput } from '@src/app/component/chip-group/chip-group.component';
import { GameOverviewComponent } from '@src/app/component/game-overview/game-overview.component';
import { BasicGame } from '@src/app/model/game';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { GameRecord, GameRecordComponent } from "@src/app/component/game-record/game-record.component";
import { SmallCompetition } from '@src/app/model/competition';
import { ScrollNearEndDirective } from '@src/app/directive/scroll-near-end/scroll-near-end.directive';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { Chip } from '@src/app/component/chip/chip.component';

type HomeAwayFilter = 'home' | 'away' | 'neutral';

@Component({
  selector: 'app-club',
  imports: [CommonModule, UiIconComponent, ExternalLinksComponent, I18nPipe, ChipGroupComponent, GameOverviewComponent, GameRecordComponent, ScrollNearEndDirective],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnDestroy {

  clubResponse!: GetClubByIdResponse;
  competitionFiltersVisible = signal(false);
  homeAwayFiltersVisible = signal(false);
  isLoading = true;

  mainClub: SmallClub = environment.mainClub;

  readonly lastGamesAgainstClub$ = new BehaviorSubject<BasicGame[]>([]);
  readonly gameRecord$ = new BehaviorSubject<GameRecord>({ w: 0, d: 0, l: 0 });
  readonly competitionChips$ = new BehaviorSubject<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly homeAwayChips$ = new BehaviorSubject<ChipGroupInput>({ chips: [], mode: 'single' });

  private readonly clubResolver = inject(ClubResolver);
  private readonly countryFlagService = inject(CountryFlagService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  private storedGames: BasicGame[] = [];
  private currentActivePage = 1;
  private currentCompetitionFilters: CompetitionId[] = [];
  private currentHomeAwayFilters: HomeAwayFilter[] = [];
  
  private isCurrentlyLoadingMore = false;
  private isLoadingMoreAvailable = false;

  private readonly gamesPageSize = 20;

  constructor() {
    this.router.events.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.loadClubDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClubResolved(clubResponse: GetClubByIdResponse): void {
    this.clubResponse = clubResponse;

    this.currentCompetitionFilters = [];

    if (this.clubResponse.allGames) {
      this.storedGames = this.clubResponse.allGames.map(game => ({ ...game, opponent: this.clubResponse.club }));

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
    }

    this.isLoading = false;
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

  getIconUrl() {
    return this.clubResponse.club.iconSmall;
  }

  getNationalities(): CountryFlag[] {
    return this.countryFlagService.resolveNationalities([this.clubResponse.club.countryCode]);
  }

  getExternalLinks() {
    return this.clubResponse.externalLinks ? [...this.clubResponse.externalLinks].filter(item => item.provider === 'sofascore') : [];
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
    this.lastGamesAgainstClub$.next(visibleGames.slice(0, updatedVisibleGamesSize));

    this.isLoadingMoreAvailable = updatedVisibleGamesSize < this.storedGames.length;
  }

  private loadClubDetails() {
    const clubId = this.route.snapshot.paramMap.get(PATH_PARAM_CLUB_ID);
    this.isLoading = true;
    if (isDefined(clubId)) {
      this.resolveClub(Number(clubId));
    } else {
      // TODO show error content
      this.isLoading = false;
      console.error(`Could not resolve club ID`);
    }
  }

  private resolveClub(clubId: ClubId) {
    this.clubResolver.getById(clubId, undefined, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: clubResponse => {
        this.onClubResolved(clubResponse);
      },
      error: err => {
        // TODO show error
        this.isLoading = false;
        console.error(`Could not resolve club`, err);
      }
    });
  }

  private getEffectiveCompetition(game: BasicGame): SmallCompetition {
    return game.competition.parent ?? game.competition;
  }

}
