import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ExternalSearchEntity, ExternalSearchResponseDto } from "@src/app/model/external-search";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ExternalSearchService {

    constructor(private readonly http: HttpClient) {}

    search(search: string, filters?: ExternalSearchEntity[]): Observable<ExternalSearchResponseDto> {
        return this.http.post<ExternalSearchResponseDto>(`${environment.apiBaseUrl}/v1/search/regular`, { search, filters: filters ?? [] });
    }

}