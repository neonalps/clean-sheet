import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ClubResolver } from '@src/app/module/club/resolver';
import { ensureNotNullish, isDefined } from '@src/app/util/common';
import { ClubId } from '@src/app/util/domain-types';
import { navigateToGameWithoutDetails, parseUrlSlug, PATH_PARAM_CLUB_ID } from '@src/app/util/router';
import { Subject, takeUntil } from 'rxjs';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CountryFlagService } from '@src/app/module/country-flag/service';
import { GetClubByIdResponse } from '@src/app/module/club/service';
import { ExternalLinksComponent } from '@src/app/component/external-links/external-links.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { BasicGame } from '@src/app/model/game';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { FilterableGameListComponent } from '@src/app/component/filterable-game-list/filterable-game-list.component';
import { VenueDetailsComponent } from "@src/app/component/venue-details/venue-details.component";

@Component({
  selector: 'app-club',
  imports: [CommonModule, UiIconComponent, ExternalLinksComponent, I18nPipe, FilterableGameListComponent, VenueDetailsComponent],
  templateUrl: './club.component.html',
  styleUrl: './club.component.css'
})
export class ClubComponent implements OnDestroy {

  readonly clubResponse = signal<GetClubByIdResponse | null>(null);
  readonly competitionFiltersVisible = signal(false);
  readonly homeAwayFiltersVisible = signal(false);
  readonly isLoading = signal(true);
  readonly mainClub = signal<SmallClub>(environment.mainClub);
  readonly gamesAgainstClub = signal<BasicGame[]>([]);

  readonly iconUrl = computed(() => this.clubResponse()?.club.iconSmall );
  readonly externalLinks = computed(() => {
    const links = this.clubResponse()?.externalLinks;
    return links ? [...links].filter(item => item.provider === 'sofascore') : [];
  });
  readonly nationalities = computed(() => {
    const club = this.clubResponse()?.club;
    return club ? this.countryFlagService.resolveNationalities([club.countryCode]) : [];
  });
  readonly shouldDisplayGames = computed(() => this.clubResponse()?.club.id !== this.mainClub().id);

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
    this.clubResponse.set(clubResponse);

    if (clubResponse.allGames) {
      this.gamesAgainstClub.set(clubResponse.allGames.map(game => ({ ...game, opponent: clubResponse.club })));
    }

    this.isLoading.set(false);
  }

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

  private loadClubDetails() {
    const clubId = parseUrlSlug(ensureNotNullish(this.route.snapshot.paramMap.get(PATH_PARAM_CLUB_ID)));
    this.isLoading.set(true);
    if (isDefined(clubId)) {
      this.resolveClub(Number(clubId));
    } else {
      // TODO show error content
      this.isLoading.set(false);
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
        this.isLoading.set(false);
        console.error(`Could not resolve club`, err);
      }
    });
  }

}
