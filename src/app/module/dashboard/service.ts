import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardResponse } from '@src/app/model/dashboard';
import { environment } from "@src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboard(): Observable<DashboardResponse> {
      return this.http.get<DashboardResponse>(`${environment.apiBaseUrl}/v1/dashboard`);
  }
}
