import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from './module/season/service';
import { FetchService } from './module/fetch/service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'clean-sheet';

  constructor(private readonly seasonService: SeasonService, private readonly fetchService: FetchService) {}

  ngOnInit(): void {
    this.seasonService.init();
  }

  googleLogin(): void {
    const queryParams = {
      state: "abcd",
      response_type: "code",
      client_id: "984243160947-36q75qghqgc386gpusdg71jqc653kng6.apps.googleusercontent.com",
      scope: "openid",
      redirect_uri: "http://localhost:3025/oauth/google",
    };
    
    window.location.href = ["https://accounts.google.com/o/oauth2/auth", "?", new URLSearchParams(queryParams).toString()].join("");
  }
}
