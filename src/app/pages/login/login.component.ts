import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { environment } from '@src/environments/environment';

@Component({
  selector: 'app-login',
  imports: [CommonModule, I18nPipe, ButtonComponent, UiIconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  googleLogin(): void {
    const queryParams = {
      response_type: "code",
      client_id: environment.oauth.google.clientId,
      scope: "openid profile email",
      redirect_uri: environment.oauth.google.redirectUri,
    };
    
    window.location.href = ["https://accounts.google.com/o/oauth2/auth", "?", new URLSearchParams(queryParams).toString()].join("");
  }

}
