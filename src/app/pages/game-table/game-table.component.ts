import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { BasicGame, GameStatus, ScoreTuple, UserBasicGame } from "@src/app/model/game";
import { SortOrder } from "@src/app/model/pagination";
import { GameService } from "@src/app/module/game/service";
import { Nullish } from "@src/app/util/types";
import { take } from "rxjs";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { getGameResult } from "@src/app/module/game/util";
import { ScoreFormatter } from "@src/app/module/game/score-formatter";
import { EyeIconComponent } from "@src/app/icon/eye/eye.component";
import { StarIconComponent } from "@src/app/icon/star/star.component";
import { isDefined } from "@src/app/util/common";
import { I18nPipe } from "@src/app/module/i18n/i18n.pipe";
import { FilterButtonComponent } from "@src/app/component/filter-button/filter-button.component";
import { ModalService } from "@src/app/module/modal/service";

@Component({
  selector: 'app-game-table',
  imports: [CommonModule, UiIconComponent, EyeIconComponent, StarIconComponent, I18nPipe, FilterButtonComponent],
  templateUrl: './game-table.component.html'
})
export class GameTableComponent implements OnInit {

  readonly currentPage = signal(-1);
  readonly isLoading = signal(false);
  readonly nextPageKey = signal<Nullish<string>>(null);
  readonly hasNextPage = signal(true);
  readonly pageSize = signal(20);
  readonly sortOrder = signal(SortOrder.Descending);
  readonly isFiltering = signal(false);

  private readonly games = signal<UserBasicGame[]>([]);
  readonly visibleGames = computed(() => {
    const currentPageValue = this.currentPage();
    if (currentPageValue < 0) {
      return [];
    }

    const startElement = this.currentPage() * this.pageSize();
    return [...this.games().slice(startElement, startElement + this.pageSize())];
  });

  private readonly gameService = inject(GameService);
  private readonly modalService = inject(ModalService);
  private readonly scoreFormatter = inject(ScoreFormatter);

  ngOnInit(): void {
      this.loadTable();
  }

  onGameClicked(game: BasicGame) {
    
  }

  showFilterModal() {

  }

  getResult(score: ScoreTuple | null): string {
    return this.scoreFormatter.format(score);
  }

  getGameScoreAfterPso(game: BasicGame) {
    return this.getResult(getGameResult(game, true));
  }

  getGameScoreBeforePso(game: BasicGame) {
    if (game.status === GameStatus.Scheduled) {
      return "-";
    }

    return this.getResult(getGameResult(game, false));
  }

  getResultTendencyClass(game: BasicGame): string {
    return `result-tendency-${game.resultTendency}`;
  }

  onBefore() {
    if (this.currentPage() <= 0) {
      return;
    }

    this.currentPage.update(current => current - 1);
  }

  onNext() {
    this.loadTable();
  }

  private loadTable() {
    if (this.isLoading()) {
      console.warn(`Table is already loading`);
      return;
    }

    if (!this.hasNextPage()) {
      console.warn(`No further page available`);
      return;
    }

    const currentNextPageKey = this.nextPageKey();
    const nextPageRequestParams = isDefined(currentNextPageKey) ? { nextPageKey: currentNextPageKey } : { limit: this.pageSize(), order: this.sortOrder(), status: GameStatus.Finished };

    this.isLoading.set(true);
    this.gameService.getPaginated(nextPageRequestParams)
      .pipe(
        take(1),
      ).subscribe({
        next: response => {
          this.games.update(current => this.sortOrder() === SortOrder.Ascending ? [...response.items, ...current] : [...current, ...response.items]);
          this.nextPageKey.set(response.nextPageKey);
          this.hasNextPage.set(isDefined(response.nextPageKey) )
          this.currentPage.update(current => current + 1);
          this.isLoading.set(false);
        },
        error: err => {
          console.error(err);
          this.isLoading.set(false);
        },
      })
  }

}