import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { PersonResolver } from '@src/app/module/person/resolver';
import { GetPersonByIdResponse } from '@src/app/module/person/service';
import { ensureNotNullish, getAbsolutePercentageString, isDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { parseUrlSlug, PATH_PARAM_PERSON_ID } from '@src/app/util/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PlayerIconComponent } from "@src/app/component/player-icon/player-icon.component";
import { getAge } from '@src/app/util/date';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { COLOR_LIGHT } from '@src/styles/constants';
import { getUiPlayerStats } from '@src/app/module/stats/util';
import { StatsGoalsAgainstClubsComponent } from "@src/app/component/stats-goals-against-clubs/stats-goals-against-clubs.component";
import { StatsPlayerStatsComponent } from "@src/app/component/stats-player-stats/stats-player-stats.component";
import { PlayerBaseStats, UiPlayerStats } from '@src/app/model/stats';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { UiIconDescriptor } from '@src/app/model/icon';
import { StatsPlayerHeaderComponent } from '@src/app/component/stats-player-header/stats-player-header.component';
import { CompetitionStats, StatsPlayerCompetitionComponent } from '@src/app/component/stats-player-competition/stats-player-competition.component';
import { CompetitionId, PersonId } from '@src/app/util/domain-types';
import { SmallCompetition } from '@src/app/model/competition';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ModalService } from '@src/app/module/modal/service';
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { ExternalLinksComponent } from "@src/app/component/external-links/external-links.component";
import { BasicGame } from '@src/app/model/game';
import { FilterableGameListComponent } from "@src/app/component/filterable-game-list/filterable-game-list.component";
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';

export type StatsItemType = 'gamesPlayed' | 'goalsScored' | 'assists' | 'yellowCards' | 'yellowRedCards' | 'redCards' | 'cleanSheets' | 'regulationPenaltiesTaken' | 'regulationPenaltiesFaced' | 'psoPenaltiesTaken' | 'psoPenaltiesFaced';

export type UiStatsItem = {
  itemType: StatsItemType;
  iconClasses?: string[];
  iconDescriptor?: UiIconDescriptor;
  titleText?: string;
  value: string;
}

@Component({
  selector: 'app-person',
  imports: [CommonModule, I18nPipe, PlayerIconComponent, StatsGoalsAgainstClubsComponent, StatsPlayerStatsComponent, UiIconComponent, StatsPlayerHeaderComponent, StatsPlayerCompetitionComponent, ExternalLinksComponent, FilterableGameListComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent implements OnDestroy {

  person!: GetPersonByIdResponse;

  performance$ = new BehaviorSubject<UiPlayerStats | null>(null);

  isLoading = true;
  colorLight = COLOR_LIGHT;
  playerTotalStatsRows: ReadonlyArray<UiStatsItem[]> = [];
  opponentTotalStatsRows: ReadonlyArray<UiStatsItem[]> = [];
  playerCompetitionStats: ReadonlyArray<CompetitionStats> = [];
  refereeGames$ = new BehaviorSubject<BasicGame[]>([]);

  readonly shouldDisplayPlayerStatistics = signal(false);
  readonly goalsAgainstClubsVisible = signal(false);
  readonly opponentStatsVisible = signal(false);
  readonly refereeListVisible = signal(false);

  private readonly mainClub: SmallClub = environment.mainClub;

  private readonly countryFlagService = inject(CountryFlagService);
  private readonly modalService = inject(ModalService);
  private readonly personResolver = inject(PersonResolver);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.router.events.pipe(
      takeUntil(this.destroy$),
    ).subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.loadPersonDetails();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPersonResolved(person: GetPersonByIdResponse): void {
    this.person = person;
    this.isLoading = false;

    if (person.stats) {
      const playerStats = getUiPlayerStats(person.stats.performance);
      this.playerTotalStatsRows = this.getPlayerTotalStats(playerStats.overall);
      this.playerCompetitionStats = this.getPlayerCompetitionStats(playerStats.competitions, playerStats.byCompetition);
      this.opponentTotalStatsRows = isDefined(person.stats.opponent) ? this.getPlayerTotalStats(person.stats.opponent) : [];

      this.shouldDisplayPlayerStatistics.set(this.playerCompetitionStats.length > 0);
      this.goalsAgainstClubsVisible.set(person.stats.goalsAgainstClubs !== undefined && person.stats.goalsAgainstClubs.length > 0);
      this.opponentStatsVisible.set(this.opponentTotalStatsRows.length > 0);

      const refereeGames = person.stats.refereeGames ?? [];
      this.refereeGames$.next(refereeGames);
      this.refereeListVisible.set(refereeGames.length > 0)

      this.performance$.next(playerStats);

      console.log('player stats', playerStats);
    }
  }

  getExternalLinks() {
    return this.person.externalLinks ? [...this.person.externalLinks] : [];
  }

  getFirstName() {
    return this.person.person.firstName;
  }

  getLastName() {
    return this.person.person.lastName;
  }

  getIconUrl() {
    return this.person.person.avatar;
  }

  getBirthday() {
    return this.person.person.birthday;
  }

  getPersonAge() {
    const birthday = this.getBirthday();
    if (!birthday) {
      return null;
    }

    return getAge(new Date(birthday));
  }

  getNationalities(): CountryFlag[] {
    const nationalities = this.person.person.nationalities;
    return isDefined(nationalities) ? this.countryFlagService.resolveNationalities(nationalities) : [];
  }

  getStatsAgainstMainText(): string {
    return this.translationService.translate(`stats.againstMain`, { main: this.mainClub.shortName });
  }

  getStatsForMainText(): string {
    return this.translationService.translate(`stats.forMain`, { main: this.mainClub.shortName });
  }

  onFilterOptionsSelected(filterOptions: GamePlayedFilterOptions) {
    this.showStatsModal(filterOptions);
  }

  onStatsItemClicked(itemType: StatsItemType, forMain?: boolean) {
    const filterOptions: GamePlayedFilterOptions = {};

    if (isDefined(forMain)) {
      filterOptions.forMain = forMain;
    }

    if (itemType === 'goalsScored') {
      filterOptions.goalsScored = '+1';
    }

    if (itemType === 'assists') {
      filterOptions.assists = '+1';
    } 

    if (itemType === 'gamesPlayed') {
      filterOptions.minutesPlayed = '+0';
    }

    if (itemType === 'cleanSheets') {
      filterOptions.goalsConceded = '0';
    }

    if (itemType === 'yellowCards') {
      filterOptions.yellowCard = true;
    }

    if (itemType === 'yellowRedCards') {
      filterOptions.yellowRedCard = true;
    }

    if (itemType === 'redCards') {
      filterOptions.redCard = true;
    }

    if (itemType === 'regulationPenaltiesFaced') {
      filterOptions.regulationPenaltiesFaced = '+1';
    }

    if (itemType === 'regulationPenaltiesTaken') {
      filterOptions.regulationPenaltiesTaken = '+1';
    }

    if (itemType === 'psoPenaltiesFaced') {
      filterOptions.psoPenaltiesFaced = '+1';
    }

    if (itemType === 'psoPenaltiesTaken') {
      filterOptions.psoPenaltiesTaken = '+1';
    }

    this.showStatsModal(filterOptions);
  }

  private loadPersonDetails() {
    const personId = parseUrlSlug(ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_PERSON_ID)));
    this.isLoading = true;
    if (isDefined(personId)) {
      this.resolvePerson(Number(personId));
    } else {
      // TODO show error content
      this.isLoading = false;
      console.error(`Could not resolve person ID`);
    }
  }

  private showStatsModal(filterOptions?: GamePlayedFilterOptions) {
    this.modalService.showStatsModal({
      person: {
        personId: this.person.person.id,
        firstName: this.person.person.firstName,
        lastName: this.person.person.lastName,
        avatar: this.person.person.avatar,
      },
      filterOptions: filterOptions,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      complete: () => {
        console.log('modal closed');
      }
    });
  }

  private resolvePerson(personId: PersonId) {
    this.personResolver.getById(personId, true).pipe(takeUntil(this.destroy$)).subscribe({
      next: person => {
        this.onPersonResolved(person);
      },
      error: err => {
        // TODO show error
        this.isLoading = false;
        console.error(`Could not resolve person`, err);
      }
    });
  }

  private getPlayerTotalStats(stats: PlayerBaseStats): ReadonlyArray<UiStatsItem[]> {
    const items: Array<UiStatsItem[]> = [];

    // if the person has clean sheets we assume it's a goalkeeper, so we only display goals scored and assists if they actually have some
    const cleanSheets = stats.cleanSheets ?? 0;
    const hasCleanSheets = cleanSheets > 0;

    const baseItems: UiStatsItem[] = [
      { itemType: 'gamesPlayed', iconDescriptor: { type: 'standard', content: 'football-pitch' }, titleText: this.translationService.translate('stats.games', { plural: stats.gamesPlayed }), value: `${stats.gamesPlayed}` }
    ];

    if (hasCleanSheets) {
      baseItems.push({ itemType: 'cleanSheets', iconDescriptor: { type: 'standard', content: 'goalkeeper-goal' }, titleText: this.translationService.translate('stats.cleanSheets', { plural: cleanSheets }), value: `${cleanSheets}` });
    }

    const goalsScored = stats.goalsScored ?? 0;
    if (!hasCleanSheets || goalsScored > 0) {
      baseItems.push({ itemType: 'goalsScored', iconDescriptor: { type: 'standard', content: 'football' }, titleText: this.translationService.translate('stats.goals', { plural: goalsScored }), value: `${goalsScored}` });
    }

    const assists = stats.assists ?? 0;
    if (!hasCleanSheets || assists > 0) {
      baseItems.push({ itemType: 'assists', iconDescriptor: { type: 'standard', content: 'football-shoe' }, titleText: this.translationService.translate('stats.assists', { plural: assists }), value: `${assists}` });
    }

    items.push(baseItems);

    const yellowCards = stats.yellowCards ?? 0;
    const yellowRedCards = stats.yellowRedCards ?? 0;
    const redCards = stats.redCards ?? 0;
    items.push([
        { itemType: 'yellowCards', iconDescriptor: { type: 'standard', content: 'yellow-card' }, titleText: this.translationService.translate('stats.yellowCards', { plural: yellowCards }), value: `${yellowCards}`, iconClasses: ['relative', 'left-5'] },
        { itemType: 'yellowRedCards', iconDescriptor: { type: 'standard', content: 'yellow-red-card' }, titleText: this.translationService.translate('stats.yellowRedCards', { plural: yellowRedCards }), value: `${yellowRedCards}`, iconClasses: ['relative', 'left-3'] },
        { itemType: 'redCards', iconDescriptor: { type: 'standard', content: 'red-card' }, titleText: this.translationService.translate('stats.redCards', { plural: redCards }), value: `${redCards}`, iconClasses: ['relative', 'left-5'] },
    ]);

    const penaltiesFacedItems: UiStatsItem[] = [];
    if (stats.regulationPenaltiesFaced > 0) {
      penaltiesFacedItems.push({ itemType: 'regulationPenaltiesFaced', iconDescriptor: { type: 'standard', content: 'glove' }, titleText: this.translationService.translate('stats.regulationPenaltiesSaved'), value: `${stats.regulationPenaltiesSaved} / ${stats.regulationPenaltiesFaced} (${getAbsolutePercentageString(stats.regulationPenaltiesSaved, stats.regulationPenaltiesFaced)})` });
    }

    if (stats.psoPenaltiesFaced > 0) {
      penaltiesFacedItems.push({ itemType: 'psoPenaltiesFaced', iconDescriptor: { type: 'standard', content: 'glove' }, titleText: this.translationService.translate('stats.psoPenaltiesSaved'), value: `${stats.psoPenaltiesSaved} / ${stats.psoPenaltiesFaced} (${getAbsolutePercentageString(stats.psoPenaltiesSaved, stats.psoPenaltiesFaced)})` });
    }

    if (penaltiesFacedItems.length > 0) {
      items.push(penaltiesFacedItems);
    }

    const penaltiesTakenItems: UiStatsItem[] = [];
    if (stats.regulationPenaltiesTaken > 0) {
      penaltiesTakenItems.push({ itemType: 'regulationPenaltiesTaken', iconDescriptor: { type: 'standard', content: 'goal' }, titleText: this.translationService.translate('stats.regulationPenaltiesScored'), value: `${stats.regulationPenaltiesScored} / ${stats.regulationPenaltiesTaken} (${getAbsolutePercentageString(stats.regulationPenaltiesScored, stats.regulationPenaltiesTaken)})` });
    }

    if (stats.psoPenaltiesTaken > 0) {
      penaltiesTakenItems.push({ itemType: 'psoPenaltiesTaken', iconDescriptor: { type: 'standard', content: 'goal' }, titleText: this.translationService.translate('stats.psoPenaltiesScored'), value: `${stats.psoPenaltiesScored} / ${stats.psoPenaltiesTaken} (${getAbsolutePercentageString(stats.psoPenaltiesScored, stats.psoPenaltiesTaken)})` });
    }

    if (penaltiesTakenItems.length > 0) {
      items.push(penaltiesTakenItems);
    }

    return items;
  }

  private getPlayerCompetitionStats(competitions: SmallCompetition[], competitionStats: Map<CompetitionId, PlayerBaseStats>): ReadonlyArray<CompetitionStats> {
    const result: CompetitionStats[] = [];

    const competitionIds = competitionStats.keys();
    for (const competitionId of competitionIds) {
      const competition = competitions.find(item => item.id === competitionId);
      if (!competition) {
        continue;
      }

      result.push({
        competition: {
          ...competition,
          name: processTranslationPlaceholders(competition.name, this.translationService),
          shortName: processTranslationPlaceholders(competition.shortName, this.translationService),
        },
        stats: competitionStats.get(competitionId)!,
      })
    }

    return Array.from(result);
  }

}
