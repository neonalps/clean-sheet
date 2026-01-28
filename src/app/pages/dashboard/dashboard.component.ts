import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameOverviewComponent } from "@src/app/component/game-overview/game-overview.component";
import { DashboardResponse, PlayerCompetitionItem } from '@src/app/model/dashboard';
import { DashboardResolver } from '@src/app/module/dashboard/resolver';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { BasicGame, DetailedGame } from '@src/app/model/game';
import { navigateToGameWithoutDetails, navigateToPerson } from '@src/app/util/router';
import { Router } from '@angular/router';
import { GamePerformanceTrendComponent } from "@src/app/component/game-performance-trend/game-performance-trend.component";
import { FootballShoeComponent } from "@src/app/icon/football-shoe/football-shoe.component";
import { MainFlagComponent } from "@src/app/component/main-flag/main-flag.component";
import { AuthService } from '@src/app/module/auth/service';
import { PersonId } from '@src/app/util/domain-types';
import { ChipGroupInput } from '@src/app/component/chip-group/chip-group.component';
import { Chip } from '@src/app/component/chip/chip.component';
import { processTranslationPlaceholders } from '@src/app/util/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { PlayerRankingComponent } from "@src/app/component/player-ranking/player-ranking.component";
import { Person } from '@src/app/model/person';
import { getDisplayName } from '@src/app/util/domain';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, I18nPipe, GameOverviewComponent, GamePerformanceTrendComponent, FootballShoeComponent, MainFlagComponent, PlayerRankingComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboard?: DashboardResponse;
  isLoading = signal(true);
  mainClub: SmallClub = environment.mainClub;
  games = new Subject<DetailedGame[]>;

  readonly competitionChipsVisible = signal(false);
  readonly competitionChips$ = new BehaviorSubject<ChipGroupInput>({ chips: [], mode: 'single' });
  readonly loginName = signal<string | null>(null);

  readonly topScorersLoading$ = new BehaviorSubject(true);
  readonly topScorersRanking$ = new BehaviorSubject<PlayerCompetitionItem[]>([]);

  private readonly authService = inject(AuthService);
  private readonly dashboardResolver = inject(DashboardResolver);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.resolveDashboard();

    this.authService.profileSettings$.pipe(takeUntil(this.destroy$)).subscribe(profile => {
      if (profile === null || !profile.firstName) {
        this.loginName.set(null);
        return;
      }

      this.loginName.set(profile.firstName);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCompetitionFilterChanged(value: string | number | boolean): void {
    this.topScorersLoading$.next(true);
    this.dashboardResolver.getDashboard(['topScorers'], Number(value)).pipe(take(1)).subscribe(response => {
      if (response.topScorers) {
        this.updateTopScorers(response.topScorers.ranking);
      } else {
        this.topScorersLoading$.next(false);
      }
    });
  }

  onPlayerClicked(person: Person) {
    navigateToPerson(this.router, person.id, getDisplayName(person.firstName, person.lastName));
  }

  triggerNavigateToGame(game: BasicGame) {
    navigateToGameWithoutDetails(this.router, game.id, game.season.id);
  }

  private resolveDashboard() {
    this.dashboardResolver.getDashboard().pipe(take(1)).subscribe({
      next: dashboard => {
        this.onDashboardResolved(dashboard);
      },
      error: err => {
        // TODO show error
        this.isLoading.set(false);
        console.error(`Could not resolve dashboard`, err);
      }
    });
  }

  private onDashboardResolved(response: DashboardResponse) {
    this.dashboard = response;
    this.isLoading.set(false);

    if (this.dashboard.performanceTrend?.games) {
      this.games.next(this.dashboard.performanceTrend.games);
    }

    if (this.dashboard.topScorers) {
      this.updateTopScorers(this.dashboard.topScorers.ranking);
    }

    if (this.dashboard.topScorers?.competitions && this.dashboard.topScorers.competitions.length > 1) {
      const chips: Chip[] = [
        { value: 'all', displayText: this.translationService.translate('competitions.all'), selected: true,  },
        ...this.dashboard.topScorers.competitions.map(item => {
          const competitionShortName = processTranslationPlaceholders(item.shortName, this.translationService);
          const competitionChip: Chip = {
            value: item.id,
            //displayText: competitionShortName,
            selected: false,
          }

          if (item.iconSmall) {
            competitionChip.displayIcon = {
              type: 'competition',
              content: item.iconSmall,
            }
          }

          return competitionChip;
        }),
      ]

      this.competitionChips$.next({
        chips: chips,
        mode: 'single',
        chipBoundingClassNames: ['min-h-32'],
      });
      this.competitionChipsVisible.set(true);
    } else {
      this.competitionChipsVisible.set(false);
      this.competitionChips$.next({ chips: [], mode: 'single' });
    }
  }

  private updateTopScorers(ranking: PlayerCompetitionItem[]) {
    this.topScorersRanking$.next(ranking);
  }

}
