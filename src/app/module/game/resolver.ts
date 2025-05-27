import { Injectable } from '@angular/core';
import { GameService } from './service';
import { DetailedGame } from '@src/app/model/game';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameResolver {

  constructor(private readonly gameService: GameService) {}

  getById(gameId: number): Observable<DetailedGame> {
    // TODO here we could also read and write from/to the cache in case the network is not available
    return this.gameService.getById(gameId);
  }

}
