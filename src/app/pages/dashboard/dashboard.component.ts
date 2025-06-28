import { Component, OnInit } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameOverviewComponent } from "@src/app/component/game-overview/game-overview.component";
import { DashboardResponse } from '@src/app/model/dashboard';
import { DashboardResolver } from '@src/app/module/dashboard/resolver';
import { take } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SmallClub } from '@src/app/model/club';
import { environment } from '@src/environments/environment';
import { BasicGame, DetailedGame } from '@src/app/model/game';
import { navigateToGame, navigateToGameWithoutDetails } from '@src/app/util/router';
import { Router } from '@angular/router';
import { CardSkeletonComponent } from "@src/app/component/card-skeleton/card-skeleton.component";
import { GameSmallComponent } from "@src/app/component/game-small/game-small.component";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, I18nPipe, GameOverviewComponent, CardSkeletonComponent, GameSmallComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dashboard?: DashboardResponse;
  isLoading = true;
  mainClub: SmallClub = environment.mainClub;

  constructor(private readonly dashboardResolver: DashboardResolver, private readonly router: Router) {}

  ngOnInit(): void {
    this.resolveDashboard();
  }

  triggerNavigateToGame(game: DetailedGame) {
    navigateToGame(this.router, game);
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
  }

}
