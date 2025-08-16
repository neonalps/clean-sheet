import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeasonService } from './module/season/service';
import { OptionId, SelectOption } from './component/select/option';
import { debounceTime, map, merge, Observable, of, Subject, Subscription, switchMap, take, takeUntil, tap } from 'rxjs';
import { convertSeasonToSelectOption } from './module/season/util';
import { ExternalSearchService } from './module/external-search/service';
import { ExternalSearchEntity } from './model/external-search';
import { convertExternalSearchItemToSelectOption } from './module/external-search/util';
import { ToastsComponent } from "./component/toasts/toasts.component";
import { ModalsComponent } from "./component/modals/modals.component";
import { ModalService } from './module/modal/service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "./component/header/header.component";
import { MenuService } from './module/menu/service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastsComponent, ModalsComponent, HeaderComponent],
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
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly seasonService: SeasonService,
    private readonly externalSearchService: ExternalSearchService,
    private readonly menuService: MenuService,
    private readonly modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.seasonService.init();

    this.menuService.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.modifyBodyClassList(open);
      });

    this.modalService.active$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.modifyBodyClassList(open);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.subscriptions.forEach(item => item.unsubscribe());
  }

  googleLogin(): void {
    const queryParams = {
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

  private modifyBodyClassList(open: boolean) {
    if (open) {
      window.document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    } else {
      window.document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
    }
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
      { id: 10, name: "William Bøving", icon: { type: "player", content: "http://127.0.0.1:8020/p/10.png" } },
      { id: 9, name: "Otar Kiteishvili", icon: { type: "player", content: "http://127.0.0.1:8020/p/9.png" } },
      { id: 14, name: "Tochi Chukwuani", icon: { type: "player", content: "http://127.0.0.1:8020/p/14.png" } }
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
