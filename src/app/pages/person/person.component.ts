import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { PersonResolver } from '@src/app/module/person/resolver';
import { GetPersonByIdResponse } from '@src/app/module/person/service';
import { isDefined, processTranslationPlaceholders } from '@src/app/util/common';
import { PATH_PARAM_PERSON_ID } from '@src/app/util/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PlayerIconComponent } from "@src/app/component/player-icon/player-icon.component";
import { getAge } from '@src/app/util/date';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GraphIconComponent } from '@src/app/icon/graph/graph.component';
import { COLOR_LIGHT } from '@src/styles/constants';
import { getUiPlayerStats } from '@src/app/module/stats/util';
import { StatsGoalsAgainstClubsComponent } from "@src/app/component/stats-goals-against-clubs/stats-goals-against-clubs.component";
import { StatsPlayerStatsComponent } from "@src/app/component/stats-player-stats/stats-player-stats.component";
import { PlayerBaseStats, UiPlayerStats } from '@src/app/model/stats';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { UiIconDescriptor } from '@src/app/model/icon';
import { StatsPlayerHeaderComponent } from '@src/app/component/stats-player-header/stats-player-header.component';
import { CompetitionStats, StatsPlayerCompetitionComponent } from '@src/app/component/stats-player-competition/stats-player-competition.component';
import { CompetitionId } from '@src/app/util/domain-types';
import { SmallCompetition } from '@src/app/model/competition';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ModalService } from '@src/app/module/modal/service';
import { GamePlayedFilterOptions } from '@src/app/model/game-played';

export type StatsItemType = 'gamesPlayed' | 'goalsScored' | 'assists' | 'yellowCards' | 'yellowRedCards' | 'redCards';

export type UiStatsItem = {
  itemType: StatsItemType;
  iconClasses?: string[];
  iconDescriptor?: UiIconDescriptor;
  titleText?: string;
  value: number;
}

@Component({
  selector: 'app-person',
  imports: [CommonModule, I18nPipe, PlayerIconComponent, GraphIconComponent, StatsGoalsAgainstClubsComponent, StatsPlayerStatsComponent, UiIconComponent, StatsPlayerHeaderComponent, StatsPlayerCompetitionComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent implements OnDestroy {

  person!: GetPersonByIdResponse;

  performance$ = new BehaviorSubject<UiPlayerStats | null>(null);

  isLoading = true;
  colorLight = COLOR_LIGHT;
  playerTotalStatsRows: ReadonlyArray<UiStatsItem[]> = [];
  playerCompetitionStats: ReadonlyArray<CompetitionStats> = [];

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly countryFlagService: CountryFlagService,
    private readonly personResolver: PersonResolver,
    private readonly route: ActivatedRoute,
    private readonly translationService: TranslationService,
  ) {
    const personId = this.route.snapshot.paramMap.get(PATH_PARAM_PERSON_ID);
    if (isDefined(personId)) {
      this.resolvePerson(Number(personId));
    } else {
      // TODO show error content
      this.isLoading = false;
      console.error(`Could not resolve game ID`);
    }
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

      this.performance$.next(playerStats);
    }
  }

  externalLinkClicked(link: string) {
    window.open(link, '_blank');
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
    return getAge(new Date(this.getBirthday()));
  }

  getNationalities(): CountryFlag[] {
    const nationalities = this.person.person.nationalities;
    return isDefined(nationalities) ? this.countryFlagService.resolveNationalities(nationalities) : [];
  }

  onStatsItemClicked(itemType: StatsItemType) {
    const filterOptions: GamePlayedFilterOptions = {
      goalsScored: itemType === 'goalsScored' ? '+1' : '0',
      assists: itemType === 'assists' ? 1 : 0,
      yellowCard: itemType === 'yellowCards',
      yellowRedCard: itemType === 'yellowRedCards',
      redCard: itemType === 'redCards',
    };

    this.modalService.showStatsModal({
      personId: this.person.person.id,
      filterOptions: filterOptions,
    }).pipe(takeUntil(this.destroy$)).subscribe({
      complete: () => {
        console.log('modal closed');
      }
    })
  }

  private resolvePerson(personId: number) {
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
    return [
      [
        { itemType: 'gamesPlayed', iconDescriptor: { type: 'standard', content: 'football-pitch' }, titleText: 'Spiele', value: stats.gamesPlayed },
        { itemType: 'goalsScored', iconDescriptor: { type: 'standard', content: 'goal' }, titleText: 'Tore', value: stats.goalsScored },
        { itemType: 'assists', iconDescriptor: { type: 'standard', content: 'football-shoe' }, titleText: 'Assists', value: stats.assists },
      ],
      /*[
        { iconDescriptor: { type: 'standard', content: 'penalties-taken' }, titleText: 'Elfmeter angetreten', value: stats.regulationPenaltiesTaken },
        { iconDescriptor: { type: 'standard', content: 'penalties-scored' }, titleText: 'Elfmeter getroffen', value: stats.regulationPenaltiesScored },
      ],*/
      [
        { itemType: 'yellowCards', iconDescriptor: { type: 'standard', content: 'yellow-card' }, titleText: 'Gelbe Karten', value: stats.yellowCards, iconClasses: ['relative', 'left-5'] },
        { itemType: 'yellowRedCards', iconDescriptor: { type: 'standard', content: 'yellow-red-card' }, titleText: 'Gelb-Rote Karten', value: stats.yellowRedCards, iconClasses: ['relative', 'left-neg-8'] },
        { itemType: 'redCards', iconDescriptor: { type: 'standard', content: 'red-card' }, titleText: 'Rote Karten', value: stats.redCards, iconClasses: ['relative', 'left-5'] },
      ],
    ]
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
