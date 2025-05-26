import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Season } from '@src/app/model/season';
import { SeasonService } from '@src/app/module/season/service';
import { assertDefined } from '@src/app/util/common';
import { Subscription } from 'rxjs';
import { LoadingComponent } from "../../component/loading/loading.component";
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { DetailedGame } from '@src/app/model/game';
import { GameOverviewComponent } from '@src/app/component/game-overview/game-overview.component';
import { SmallClub } from '@src/app/model/club';

@Component({
  selector: 'app-season-games',
  imports: [GameOverviewComponent, CommonModule, LoadingComponent],
  templateUrl: './season-games.component.html',
  styleUrl: './season-games.component.css'
})
export class SeasonGamesComponent implements OnInit, OnDestroy {

  private seasons: Season[] = [];
  private seasonGames: Map<number, DetailedGame[]> = new Map();
  private subscriptions: Subscription[] = [];

  mainClub: SmallClub = {
    id: 1,
    name: "SK Sturm Graz",
    shortName: "Sturm Graz",
    iconSmall: "http://localhost:8020/c/1.png",
  }

  isLoading = false;
  selectedSeason: Season | null = null;
  selectedSeasonGames: DetailedGame[] = [];

  constructor(private readonly route: ActivatedRoute, private readonly seasonService: SeasonService, private readonly seasonGamesService: SeasonGamesService) {}

  ngOnInit(): void {
    this.isLoading = true;

    const seasonParam = this.route.snapshot.paramMap.get('season') as string;

    this.subscriptions.push(this.seasonService.getSeasonsObservable().subscribe(seasons => {
      this.seasons = seasons;

      if (seasons.length > 0) {
        this.loadSeasonGames(seasonParam);
      }
    }));

    this.subscriptions.push(this.seasonGamesService.getSeasonGamesObservable().subscribe(payload => {
      this.seasonGames.set(payload.seasonId, payload.games);

      if (payload.seasonId === this.selectedSeason?.id) {
        this.isLoading = false;
        this.selectedSeasonGames = payload.games;
        console.log(`received games for season ${payload.seasonId}`);
      }
    }));
  }

  async loadSeasonGames(seasonParam: string): Promise<void> {
    const season = seasonParam === 'current' ? this.seasons[0] : this.seasons.find(item => item.id === Number(seasonParam));
    assertDefined(season, `failed to find season for param ${seasonParam}`);

    this.selectedSeason = season as Season;
    
    await this.seasonGamesService.getSeasonGames(this.selectedSeason.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe()); 
  }

}
