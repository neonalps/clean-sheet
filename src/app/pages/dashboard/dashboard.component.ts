import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameOverviewComponent } from "@src/app/component/game-overview/game-overview.component";
import { DashboardResponse } from '@src/app/model/dashboard';
import { DashboardResolver } from '@src/app/module/dashboard/resolver';
import { Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { BasicGame, DetailedGame } from '@src/app/model/game';
import { navigateToGameWithoutDetails } from '@src/app/util/router';
import { Router } from '@angular/router';
import { GamePerformanceTrendComponent } from "@src/app/component/game-performance-trend/game-performance-trend.component";
import { FootballShoeComponent } from "@src/app/icon/football-shoe/football-shoe.component";
import { MainFlagComponent } from "@src/app/component/main-flag/main-flag.component";
import { AuthService } from '@src/app/module/auth/service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, I18nPipe, GameOverviewComponent, GamePerformanceTrendComponent, FootballShoeComponent, MainFlagComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboard?: DashboardResponse;
  isLoading = true;
  mainClub: SmallClub = environment.mainClub;
  games = new Subject<DetailedGame[]>;

  readonly loginName = signal<string | null>(null);

  private readonly authService = inject(AuthService);

  private readonly destroy$ = new Subject<void>();

  constructor(private readonly dashboardResolver: DashboardResolver, private readonly router: Router) {}

  ngOnInit(): void {
    this.resolveDashboard();

    this.authService.authIdentity$.pipe(takeUntil(this.destroy$)).subscribe(identity => {
      if (identity === null || !identity.firstName) {
        this.loginName.set(null);
        return;
      }

      this.loginName.set(identity.firstName);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
        this.isLoading = false;
        console.error(`Could not resolve dashboard`, err);
      }
    });
  }

  private onDashboardResolved(response: DashboardResponse) {
    this.dashboard = response;
    this.isLoading = false;

    if (this.dashboard.performanceTrend?.games) {
      this.games.next(this.dashboard.performanceTrend.games);
    }
  }

}
