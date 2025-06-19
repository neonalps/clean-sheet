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
   * Resolves a game by ID.
   * @param gameId the ID of the game that should be fetched
   * @param seasonId optional seasonId, can be passed as an indicator to fetch the game from the cache
   * @returns 
   */
  getById(gameId: number, seasonId?: number): Observable<DetailedGame> {
    if (isDefined(seasonId)) {
      // try to get the game from the cache first
      return this.getGameFromCache(seasonId, gameId).pipe(
        take(1),
        switchMap(gameOptional => {
          if (isDefined(gameOptional)) {
            return of(gameOptional);
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
