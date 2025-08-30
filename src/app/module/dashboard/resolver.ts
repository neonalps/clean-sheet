import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService } from './service';
import { DashboardResponse } from '@src/app/model/dashboard';
import { CompetitionId } from '@src/app/util/domain-types';

@Injectable({
  providedIn: 'root'
})
export class DashboardResolver {

  constructor(private readonly dashboardService: DashboardService) {}

  getDashboard(widgets: string[] = [], competitionId?: CompetitionId): Observable<DashboardResponse> {
    // here could be some caching if necessary
    return this.dashboardService.getDashboard(widgets, competitionId);
  }

}
