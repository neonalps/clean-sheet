import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from './module/season/service';
import { FetchService } from './module/fetch/service';
import { SelectComponent } from './components/select/select.component';
import { OptionId, SelectOption } from './components/select/option';
import { I18nPipe } from './module/i18n/i18n.pipe';
import { map, Observable } from 'rxjs';
import { convertToSelectOption } from './module/season/util';

@Component({
  selector: 'app-root',
  imports: [I18nPipe, RouterOutlet, SelectComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'clean-sheet';

  private selectedSeasonId: number | null = null;

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


  getSeasonOptions(): Observable<SelectOption[]> {
    return this.seasonService.getSeasonsObservable().pipe(
      map(seasons => seasons.map(item => convertToSelectOption(item))),
    );
  }

  onSeasonSelected(seasonId: OptionId): void {
    this.selectedSeasonId = seasonId as number;
  }

  currentlySelected(): string {
    return this.selectedSeasonId === null ? 'none' : this.selectedSeasonId.toString();
  }
}
