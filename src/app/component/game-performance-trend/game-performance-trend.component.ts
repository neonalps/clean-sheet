import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DetailedGame } from '@src/app/model/game';
import { Observable, Subject, takeUntil } from 'rxjs';
import { GameSmallComponent } from '@src/app/component/game-small/game-small.component';
import { navigateToGame } from '@src/app/util/router';
import { Router } from '@angular/router';
import { calculatePerformanceTrend } from '@src/app/module/game/util';

@Component({
  selector: 'app-game-performance-trend',
  imports: [CommonModule, GameSmallComponent],
  templateUrl: './game-performance-trend.component.html',
  styleUrl: './game-performance-trend.component.css'
})
export class GamePerformanceTrendComponent implements OnInit, OnDestroy {

  @Input() games$!: Observable<DetailedGame[]>;
  @Input() showGameDate = false;

  isLoading = true;
  games: DetailedGame[] = [];
  score: number | null = null;
  placeholderElements: number[] = [];

  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.games$.pipe(takeUntil(this.destroy$)).subscribe(trendGames => {
      this.isLoading = true;
      this.games = trendGames;
      this.score = calculatePerformanceTrend(trendGames.map(game => game.resultTendency));

      const requiredPlaceholderElements =  Math.max(5 - trendGames.length, 0);
      this.placeholderElements = [...Array(requiredPlaceholderElements).keys()];
      this.isLoading = false;
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  triggerNavigateToGame(game: DetailedGame) {
    navigateToGame(this.router, game);
  }

}
