import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { generateRandomString } from "@src/app/util/common";
import { encode } from "@src/app/util/base64";
import { AuthService } from "./service";

export interface PostLoginTarget {
  state: string;
  target: string;
}

export function loginRedirect(router: Router, targetUrl: string): Promise<boolean> {
  const postLoginTarget: PostLoginTarget = {
    state: generateRandomString(12),
    target: targetUrl,
  };

  const encodedRedirectState = encode(JSON.stringify(postLoginTarget));
  return router.navigate(['/login'], { queryParams: { state: encodedRedirectState } });
} 

export async function loggedInGuard(_: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return inject(AuthService).isLoggedIn() ? true : loginRedirect(inject(Router), state.url);
};

export async function roleGuard(route: ActivatedRouteSnapshot): Promise<boolean> {
    return inject(AuthService).hasRole(route.data['role']) ? true : inject(Router).navigate(['/dashboard']);
};