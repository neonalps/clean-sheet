import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BasicVenue } from "@src/app/model/venue";
import { VenueId } from "@src/app/util/domain-types";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

export type UpdateVenue = {
  name: string;
  shortName: string;
  city: string;
  countryCode: string;
  capacity: number;
  latitude: number;
  longitude: number;
};

export type CreateVenue = UpdateVenue;

@Injectable({
    providedIn: 'root'
})
export class VenueService {

    constructor(private http: HttpClient) {}

    getById(venueId: VenueId, includeHomeVenueFor?: boolean): Observable<BasicVenue> {
        const queryStringSuffix = includeHomeVenueFor ? `?includeHomeVenueFor=true` : '';
        return this.http.get<BasicVenue>(`${environment.apiBaseUrl}/v1/venues/${venueId}${queryStringSuffix}`);
    }

    create(create: CreateVenue): Observable<BasicVenue> {
        return this.http.post<BasicVenue>(`${environment.apiBaseUrl}/v1/venues`, create);
    }

}