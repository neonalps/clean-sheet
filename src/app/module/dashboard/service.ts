import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboardResponse } from '@src/app/model/dashboard';
import { CompetitionId } from '@src/app/util/domain-types';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  private readonly http = inject(HttpClient);

  getDashboard(widgets: string[] = [], competitionId?: CompetitionId): Observable<DashboardResponse> {
    const queryParams = new URLSearchParams();

    if (widgets.length > 0) {
      queryParams.set('widgets', widgets.join(','));
    }

    if (competitionId) {
      queryParams.set('competition', `${competitionId}`);
    }

    return this.http.get<DashboardResponse>(`${environment.apiBaseUrl}/v1/dashboard${queryParams.size > 0 ? `?${queryParams.toString()}` : ''}`);
  }
}
