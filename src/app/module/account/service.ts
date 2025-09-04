import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account, AccountProfile, Language, UpdateAccountProfile } from "@src/app/model/account";
import { PaginatedResponse } from "@src/app/model/pagination";
import { environment } from "@src/environments/environment";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private readonly profileLanguageSource = new Subject<Language>();
  readonly profileLanguage$ = this.profileLanguageSource.asObservable();

  constructor(private http: HttpClient) {}

  getAccountProfile(): Observable<AccountProfile> {
    return this.http.get<AccountProfile>(`${environment.apiBaseUrl}/v1/account/profile`)
      .pipe(tap(profile => {
        this.profileLanguageSource.next(profile.language);
      }));
  }

  updateAccountProfile(updateProfile: UpdateAccountProfile): Observable<AccountProfile> {
    return this.http.put<AccountProfile>(`${environment.apiBaseUrl}/v1/account/profile`, updateProfile)
      .pipe(tap(profile => {
        this.profileLanguageSource.next(profile.language);
      }));
  }

  getAccounts(): Observable<PaginatedResponse<Account>> {
    return this.http.get<PaginatedResponse<Account>>(`${environment.apiBaseUrl}/v1/accounts`);
  }
}
