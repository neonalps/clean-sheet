import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Account } from "@src/app/model/account";
import { PaginatedResponse } from "@src/app/model/pagination";
import { environment } from "@src/environments/environment";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) { }

  getAccounts(): Observable<PaginatedResponse<Account>> {
      return this.http.get<PaginatedResponse<Account>>(`${environment.apiBaseUrl}/v1/accounts`);
  }
}
