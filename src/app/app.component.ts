import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from './module/season/service';
import { OptionId, SelectOption } from './component/select/option';
import { debounceTime, map, merge, Observable, of, Subject, Subscription, switchMap, tap } from 'rxjs';
import { convertSeasonToSelectOption } from './module/season/util';
import { ExternalSearchService } from './module/external-search/service';
import { ExternalSearchEntity } from './model/external-search';
import { convertExternalSearchItemToSelectOption } from './module/external-search/util';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'clean-sheet';

  private selectedSeasonId: number | null = null;
  private selectedPlayerId: number | null = null;

  isSearchingForPlayer = false;
  private playerSearch = new Subject<string>();

  private subscriptions: Subscription[] = [];

  constructor(private readonly seasonService: SeasonService, private readonly externalSearchService: ExternalSearchService) {}

  ngOnInit(): void {
    this.seasonService.init();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
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

  getSeasonsOptionSource(): Observable<SelectOption[]> {
    return this.seasonService.getSeasonsObservable().pipe(
      map(seasons => seasons.map(item => convertSeasonToSelectOption(item))),
    );
  }

  getPersonOptionSource(): Observable<SelectOption[]> {
    return this.getPlayerOptions();
  }

  private getPlayerOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultPlayerOptions(), this.searchForPlayer());
  }

  private searchForPlayer(): Observable<SelectOption[]> {
    return this.playerSearch.pipe(
      debounceTime(250),
      tap(() => this.isSearchingForPlayer = true),
      switchMap(value => {
        if (value.trim().length === 0) {
          return this.getDefaultPlayerOptions();  
        }

        return this.externalSearchService.search(value, [ExternalSearchEntity.Person]);
      }),
      tap(() => this.isSearchingForPlayer = false),
      map(response => {
        if ('items' in response) {
          return response.items.map(item => convertExternalSearchItemToSelectOption(item));
        }

        return response;
      }),
    );
  }

  private getDefaultPlayerOptions(): Observable<SelectOption[]> {
    return of([
      { id: 10, name: "William Bøving", icon: "http://127.0.0.1:8020/p/10.png" },
      { id: 9, name: "Otar Kiteishvili", icon: "http://127.0.0.1:8020/p/9.png" },
      { id: 14, name: "Tochi Chukwuani", icon: "http://127.0.0.1:8020/p/14.png" }
    ])
  }

  onSeasonSelected(seasonId: OptionId): void {
    this.selectedSeasonId = seasonId as number;
  }

  onPlayerSelected(playerId: OptionId): void {
    this.selectedPlayerId = playerId as number;
  }

  onPlayerSearchChange(search: string): void {
    this.playerSearch.next(search);
  }

  currentlySelected(): string {
    return this.selectedSeasonId === null ? 'none' : this.selectedSeasonId.toString();
  }

  currentlySelectedPlayer(): string {
    return this.selectedPlayerId === null ? 'none': this.selectedPlayerId.toString();
  }
}
