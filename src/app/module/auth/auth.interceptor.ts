import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './service';
import { getNow } from '@src/app/util/date';
import { TokenResponse } from '@src/app/model/auth';

const excludedUrls: string[] = [
  AuthService.OAUTH_LOGIN_URL,
  AuthService.REFRESH_TOKEN_URL,
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (excludedUrls.includes(req.url)) {
    return next(req);
  }

  let authReq = req;
  const authService = inject(AuthService);
  
  const currentAccessToken = authService.getAccessToken();

  const currentAccessTokenExpiresAt = new Date(currentAccessToken.expiresAt);
  if (currentAccessTokenExpiresAt !== null && getNow() <= currentAccessTokenExpiresAt) {
    authReq = addAuthHeader(req, currentAccessToken.token);
    return next(authReq);
  }

  // access token is expired, we try to get a new one by using the refresh token
  const currentRefreshToken = authService.getRefreshToken();
  const currentRefreshTokenExpiresAt = new Date(currentRefreshToken.expiresAt);
  if (getNow() <= currentRefreshTokenExpiresAt) {
    return authService.refreshToken(currentRefreshToken.token).pipe(
      switchMap((tokenResponse: TokenResponse) => {
        authReq = addAuthHeader(req, tokenResponse.accessToken);
        return next(authReq);
      }),
      catchError((error) => {
        console.error(error);
        return throwError(() => error);
      })
    )
  }

  // the refresh token is also expired, the user needs to log in again
  return next(authReq).pipe(
    catchError(error => {
      console.error(error);
      authService.logout();
      return throwError(() => error);
    })
  );
};

function addAuthHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({ headers: request.headers.set("Authorization", `Bearer ${token}`) });
}