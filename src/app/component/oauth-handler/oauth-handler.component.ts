import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@src/app/module/auth/service';
import { assertHasText } from '@src/app/util/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-oauth-handler',
  imports: [],
  templateUrl: './oauth-handler.component.html',
  styleUrl: './oauth-handler.component.css'
})
export class OAuthHandlerComponent implements OnInit {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const queryParams = new URLSearchParams(window.location.search);
    
    const code: string = queryParams.get("code") as string;
    assertHasText(code, `OAuth handler called without code`);

    this.handleOAuthLogin(code);
  }

  private handleOAuthLogin(code: string) {
    this.authService.handleOAuthLogin("google", code)
      .pipe(take(1))
      .subscribe({
        next: _ => {
          setTimeout(() => this.router.navigate(['/dashboard']));
        },
        error: error => {
          console.error(error);
        }
      });
  }

}
