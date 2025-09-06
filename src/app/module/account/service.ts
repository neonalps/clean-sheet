import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account, AccountProfile, UpdateAccountProfile } from "@src/app/model/account";
import { PaginatedResponse } from "@src/app/model/pagination";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  getAccountProfile(): Observable<AccountProfile> {
    return this.http.get<AccountProfile>(`${environment.apiBaseUrl}/v1/account/profile`);
  }

  updateAccountProfile(updateProfile: UpdateAccountProfile): Observable<AccountProfile> {
    return this.http.put<AccountProfile>(`${environment.apiBaseUrl}/v1/account/profile`, updateProfile);
  }

  getAccounts(): Observable<PaginatedResponse<Account>> {
    return this.http.get<PaginatedResponse<Account>>(`${environment.apiBaseUrl}/v1/accounts`);
  }
}
