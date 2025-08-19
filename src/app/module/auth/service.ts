import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { AuthResponse, Identity } from "@src/app/model/auth";
import { assertHasText } from "@src/app/util/common";
import { environment } from "@src/environments/environment";
import { BehaviorSubject, Observable, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    readonly authIdentity$ = new BehaviorSubject<Identity | null>(null);

    private readonly authState = signal<AuthResponse | null>(null);

    private static readonly OAUTH_LOGIN_URL =`${environment.apiBaseUrl}/v1/auth/oauth`;
    private static readonly REFRESH_TOKEN_URL =`${environment.apiBaseUrl}/v1/auth/refresh-token`;

    private readonly http = inject(HttpClient);

    public handleOAuthLogin(provider: string, code: string): Observable<AuthResponse> {
        assertHasText(provider);
        assertHasText(code);

        return this.http.post<AuthResponse>(AuthService.OAUTH_LOGIN_URL, {
            provider,
            code,
            }).pipe(
                tap((authResponse: AuthResponse) => {
                    this.authState.set(authResponse);
                    
                    this.authIdentity$.next(authResponse.identity);
                }),
        );
    }

}