import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/module/auth/service';
import { assertHasText } from '@src/app/util/common';
import { Nullish } from '@src/app/util/types';
import { take } from 'rxjs';

@Component({
  selector: 'app-login-with-token-handler',
  imports: [],
  template: '',
})
export class LoginWithTokenHandlerComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    
    const token: string = queryParams.get("t") as string;
    assertHasText(token, `Login with token handler called without token`);

    this.handleLoginWithToken(token, queryParams.get("redirectTo"));
  }

  private handleLoginWithToken(token: string, redirectTo: Nullish<string>) {
    this.authService.handleLoginWithToken(token)
      .pipe(take(1))
      .subscribe({
        next: _ => {
          setTimeout(() => this.router.navigate([`/${redirectTo ?? 'dashboard'}`]));
        },
        error: error => {
          console.error(error);
        }
      });
  }

}
