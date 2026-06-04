import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BasicVenue } from "@src/app/model/venue";
import { VenueId } from "@src/app/util/domain-types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VenueService {

    constructor(private http: HttpClient) {}

    getById(venueId: VenueId): Observable<BasicVenue> {
        return this.http.get<BasicVenue>(`${environment.apiBaseUrl}/v1/venues/${venueId}`);
    }

}