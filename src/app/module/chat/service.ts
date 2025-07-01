import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "@src/environments/environment";
import { SearchAnswer } from "@src/app/model/chat";

export type MagicSearchResponseDto = {
    answer: SearchAnswer;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

    constructor(private http: HttpClient) { }

    postMagicSearchQuery(inquiry: string): Observable<MagicSearchResponseDto> {
        return this.http.post<MagicSearchResponseDto>(`${environment.apiBaseUrl}/v1/search/magic`, { inquiry: inquiry });
    }

}