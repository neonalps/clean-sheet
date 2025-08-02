import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { PersonResolver } from '@src/app/module/person/resolver';
import { GetPersonByIdResponse } from '@src/app/module/person/service';
import { isDefined } from '@src/app/util/common';
import { PATH_PARAM_PERSON_ID } from '@src/app/util/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { PlayerIconComponent } from "@src/app/component/player-icon/player-icon.component";
import { getAge } from '@src/app/util/date';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { BirthdayCakeComponent } from "@src/app/icon/birthday-cake/birthday-cake.component";
import { GraphIconComponent } from '@src/app/icon/graph/graph.component';
import { COLOR_LIGHT } from '@src/styles/constants';
import { getUiPlayerStats } from '@src/app/module/stats/util';
import { StatsGoalsAgainstClubsComponent } from "@src/app/component/stats-goals-against-clubs/stats-goals-against-clubs.component";
import { StatsPlayerStatsComponent } from "@src/app/component/stats-player-stats/stats-player-stats.component";
import { UiPlayerStats } from '@src/app/model/stats';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

@Component({
  selector: 'app-person',
  imports: [CommonModule, I18nPipe, PlayerIconComponent, GraphIconComponent, StatsGoalsAgainstClubsComponent, StatsPlayerStatsComponent, UiIconComponent],
  templateUrl: './person.component.html',
  styleUrl: './person.component.css'
})
export class PersonComponent implements OnDestroy {

  person!: GetPersonByIdResponse;

  performance$ = new BehaviorSubject<UiPlayerStats | null>(null);

  isLoading = true;
  colorLight = COLOR_LIGHT;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly countryFlagService: CountryFlagService,
    private readonly personResolver: PersonResolver,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
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
      this.performance$.next(getUiPlayerStats(person.stats.performance));
    }
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

}
