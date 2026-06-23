import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetPersonByIdResponse, PersonService } from './service';

@Injectable({
  providedIn: 'root'
})
export class PersonResolver {

  constructor(private readonly personService: PersonService) {}

  getById(personId: number, includeContract = false, includeStatistics = false): Observable<GetPersonByIdResponse> {
    // here could be some caching if necessary
    return this.personService.getById(personId, includeContract, includeStatistics);
  }

}
