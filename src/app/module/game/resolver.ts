import { inject, Injectable } from '@angular/core';
import { GameService } from './service';
import { DetailedGame } from '@src/app/model/game';
import { from, map, Observable, of, switchMap } from 'rxjs';
import { SeasonGamesService } from '@src/app/module/season-games/service';
import { isDefined, isNotDefined } from '@src/app/util/common';
import { GameId, SeasonId } from '@src/app/util/domain-types';

@Injectable({
  providedIn: 'root'
})
export class GameResolver {

  private readonly gameService = inject(GameService);
  private readonly seasonGamesService = inject(SeasonGamesService);

  /**
   * Resolves a game by ID.
   * @param gameId the ID of the game that should be fetched
   * @param seasonId optional seasonId, can be passed as an indicator to fetch the game from the cache
   * @returns 
   */
  getById(gameId: GameId, seasonId?: SeasonId): Observable<DetailedGame> {
    if (isDefined(seasonId)) {
      // try to get the game from the cache first
      return this.getGameFromCache(seasonId, gameId).pipe(
        switchMap(gameOptional => {
          if (isDefined(gameOptional)) {
            console.log('resolved via cache');
            return of(gameOptional);
          }
          
          console.log('resolved via network');
          return this.gameService.getById(gameId);
        }),
      );
    } else {
      console.log('resolved via network');
      return this.gameService.getById(gameId);
    }
  }

  private getGameFromCache(seasonId: SeasonId, gameId: GameId): Observable<DetailedGame | null> {
    return from(this.seasonGamesService.getSeasonGamesFromCache(seasonId))
      .pipe(
        map((cacheEntry: DetailedGame[] | undefined) => {
          if (isNotDefined(cacheEntry)) {
            return null;
          }

          return cacheEntry.find(game => game.id === gameId) ?? null;
        })
      )
  } 

}
