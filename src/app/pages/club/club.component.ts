import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClubResolver } from '@src/app/module/club/resolver';
import { isDefined } from '@src/app/util/common';
import { ClubId } from '@src/app/util/domain-types';
import { navigateToGameWithoutDetails, PATH_PARAM_CLUB_ID } from '@src/app/util/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { GetClubByIdResponse } from '@src/app/module/club/service';
import { ExternalLinksComponent } from '@src/app/component/external-links/external-links.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { BasicGame } from '@src/app/model/game';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { FilterableGameListComponent } from '@src/app/component/filterable-game-list/filterable-game-list.component';

@Component({
  selector: 'app-club',
  imports: [CommonModule, UiIconComponent, ExternalLinksComponent, I18nPipe, FilterableGameListComponent],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnDestroy {

  clubResponse!: GetClubByIdResponse;
  competitionFiltersVisible = signal(false);
  homeAwayFiltersVisible = signal(false);
  isLoading = true;

  mainClub: SmallClub = environment.mainClub;

  readonly gamesAgainstClub$ = new BehaviorSubject<BasicGame[]>([]);

  private readonly clubResolver = inject(ClubResolver);
  private readonly countryFlagService = inject(CountryFlagService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

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

    if (this.clubResponse.allGames) {
      this.gamesAgainstClub$.next(this.clubResponse.allGames.map(game => ({ ...game, opponent: this.clubResponse.club })));
    }

    this.isLoading = false;
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

}
