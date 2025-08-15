import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ClubService, GetClubByIdResponse } from './service';

@Injectable({
  providedIn: 'root'
})
export class ClubResolver {

  constructor(private readonly clubService: ClubService) {}

  getById(clubId: number, includeLastGames: boolean = false, includeAllGames: boolean = false): Observable<GetClubByIdResponse> {
    // here could be some caching if necessary
    return this.clubService.getById(clubId, includeLastGames, includeAllGames);
  }

}
