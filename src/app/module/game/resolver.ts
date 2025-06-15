import { Injectable } from '@angular/core';
import { GameService } from './service';
import { DetailedGame } from '@src/app/model/game';
import { from, map, Observable, of, switchMap, take } from 'rxjs';
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { isDefined, isNotDefined } from '@src/app/util/common';

@Injectable({
  providedIn: 'root'
})
export class GameResolver {

  constructor(private readonly gameService: GameService, private readonly seasonGamesService: SeasonGamesService) {}

  /**
   * 
   * @param gameId 
   * @param seasonId optional seasonId, can be passed to 
   * @returns 
   */
  getById(gameId: number, seasonId?: number): Observable<DetailedGame> {
    if (isDefined(seasonId)) {
      return this.getGameFromCache(seasonId, gameId).pipe(
        take(1),
        switchMap(gameOptional => {
          if (isDefined(gameOptional)) {
            return of(gameOptional)
          }
          
          return this.gameService.getById(gameId);
        }),
      );
    } else {
      return this.gameService.getById(gameId);
    }
  }

  private getGameFromCache(seasonId: number, gameId: number): Observable<DetailedGame | null> {
    return from(this.seasonGamesService.getSeasonGamesFromCache(seasonId))
      .pipe(
        take(1),
        map((cacheEntry: DetailedGame[] | undefined) => {
          if (isNotDefined(cacheEntry)) {
            return null;
          }

          return cacheEntry.find(game => game.id === gameId) ?? null;
        })
      )
  } 

}
