import { Injectable } from "@angular/core";
import { ExternalSearchService } from "@src/app/module/external-search/service";
import { PersonService } from "@src/app/module/person/service";

@Injectable({
  providedIn: 'root'
})
export class LineupSelectorService {

    constructor(
        private readonly externalSearchService: ExternalSearchService,
        private readonly personService: PersonService,
    ) {}

}