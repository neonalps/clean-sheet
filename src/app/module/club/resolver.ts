import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubService } from './service';
import { BasicClub } from '@src/app/model/club';

@Injectable({
  providedIn: 'root'
})
export class ClubResolver {

  constructor(private readonly clubService: ClubService) {}

  getById(clubId: number, includeLastGames: boolean = false): Observable<BasicClub> {
    // here could be some caching if necessary
    return this.clubService.getById(clubId, includeLastGames);
  }

}
