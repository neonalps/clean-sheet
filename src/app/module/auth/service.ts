import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { AccountRole, AuthResponse, Identity, ProfileSettings, TokenResponse } from "@src/app/model/auth";
import { assertHasText, ensureNotNullish } from "@src/app/util/common";
import { environment } from "@src/environments/environment";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { LocalStorageStorageProvider } from "@src/app/module/storage/local-storage";
import { DateString } from "@src/app/util/domain-types";
import { parseJwt } from "@src/app/util/token";
import { getDateFromUnixTimestamp } from "@src/app/util/date";

export type StoredToken = {
    token: string;
    expiresAt: DateString;
}

type AuthState = {
    identity: Identity;
    profileSettings: ProfileSettings;
    accessToken: StoredToken;
    refreshToken: StoredToken;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    public static readonly STORAGE_KEY_AUTH = "auth";

    public static readonly OAUTH_LOGIN_URL =`${environment.apiBaseUrl}/v1/auth/oauth`;
    public static readonly REFRESH_TOKEN_URL =`${environment.apiBaseUrl}/v1/auth/refresh-token`;

    private static readonly TOKEN_KEY_EXP = "exp";

    readonly authIdentity$ = new BehaviorSubject<Identity | null>(null);
    readonly profileSettings$ = new BehaviorSubject<ProfileSettings | null>(null);

    private readonly authState = signal<AuthState | null>(null);

    private readonly http = inject(HttpClient);
    private readonly localStorageService = inject(LocalStorageStorageProvider);

    private readonly isInitialized = signal(false);

    public init() {
        if (this.isInitialized()) {
            throw new Error(`Auth service is already initialized`);
        }

        this.isInitialized.set(true);

        const storedAuth = this.localStorageService.get<AuthResponse>(AuthService.STORAGE_KEY_AUTH);
        if (storedAuth) {
            this.onSuccessfulLogin(storedAuth);
        }
    }

    public getAccessToken(): StoredToken {
        return this.requireAuthState().accessToken;
    }

    public getRefreshToken(): StoredToken {
        return this.requireAuthState().refreshToken;
    }

    public isLoggedIn(): boolean {
        return this.isInitialized() && this.authState() !== null;
    }

    public hasRole(role: AccountRole): boolean {
        return this.isLoggedIn() && role === ensureNotNullish(this.authState()).identity.role;
    }

    public logout() {
        this.localStorageService.remove(AuthService.STORAGE_KEY_AUTH);
        this.authState.set(null);
        this.authIdentity$.next(null);
        this.profileSettings$.next(null);
    }

    public handleOAuthLogin(provider: string, code: string): Observable<AuthResponse> {
        assertHasText(provider);
        assertHasText(code);

        return this.http.post<AuthResponse>(AuthService.OAUTH_LOGIN_URL, { provider, code }).pipe(
            tap((authResponse: AuthResponse) => {
                this.onSuccessfulLogin(authResponse);
            }),
        );
    }

    public refreshToken(refreshToken: string): Observable<TokenResponse> {
        assertHasText(refreshToken);

        return this.http.post<TokenResponse>(AuthService.REFRESH_TOKEN_URL, { refreshToken }).pipe(
            tap((tokenResponse: TokenResponse) => {
                this.onSuccessfulTokenRefresh(tokenResponse);
            }),
        );
    }

    private onSuccessfulLogin(auth: AuthResponse) {
        const parsedAccessToken = parseJwt(auth.token.accessToken);
        
        const accessTokenExpiresAtUnix = parsedAccessToken[AuthService.TOKEN_KEY_EXP];
        const refreshTokenExpiresAtUnix = parseJwt(auth.token.refreshToken)[AuthService.TOKEN_KEY_EXP];

        const authState: AuthState = {
            identity: auth.identity,
            profileSettings: auth.profileSettings,
            accessToken: {
                token: auth.token.accessToken,
                expiresAt: getDateFromUnixTimestamp(accessTokenExpiresAtUnix).toISOString(),
            },
            refreshToken: {
                token: auth.token.refreshToken,
                expiresAt: getDateFromUnixTimestamp(refreshTokenExpiresAtUnix).toISOString(),
            },
        };

        this.localStorageService.set(AuthService.STORAGE_KEY_AUTH, auth satisfies AuthResponse);
        this.authState.set(authState);
        this.authIdentity$.next(auth.identity);
        this.profileSettings$.next(auth.profileSettings);
    }

    private onSuccessfulTokenRefresh(token: TokenResponse) {
        const parsedAccessToken = parseJwt(token.accessToken);
        
        const accessTokenExpiresAtUnix = parsedAccessToken[AuthService.TOKEN_KEY_EXP];
        const refreshTokenExpiresAtUnix = parseJwt(token.refreshToken)[AuthService.TOKEN_KEY_EXP];

        const currentAuthState = ensureNotNullish(this.authState());

        const authState: AuthState = {
            identity: currentAuthState.identity,
            profileSettings: currentAuthState.profileSettings,
            accessToken: {
                token: token.accessToken,
                expiresAt: getDateFromUnixTimestamp(accessTokenExpiresAtUnix).toISOString(),
            },
            refreshToken: {
                token: token.refreshToken,
                expiresAt: getDateFromUnixTimestamp(refreshTokenExpiresAtUnix).toISOString(),
            },
        };

        this.localStorageService.set(AuthService.STORAGE_KEY_AUTH, {
            identity: currentAuthState.identity,
            token: token,
            profileSettings: currentAuthState.profileSettings,
        } satisfies AuthResponse);
        this.authState.set(authState);
    }

    private requireAuthState(): AuthState {
        const authState = this.authState();
        if (authState === null) {
            throw new Error(`User is not logged in`);
        }
        return authState;
    }

}