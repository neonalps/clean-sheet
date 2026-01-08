import { Component, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { TabGroupComponent } from "@src/app/component/tab-group/tab-group.component";
import { BehaviorSubject, combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { TabItemComponent } from "@src/app/component/tab-item/tab-item.component";
import { UiIconDescriptor } from '@src/app/model/icon';
import { environment } from '@src/environments/environment';
import { LineupSelectorComponent } from "@src/app/component/lineup-selector/lineup-selector.component";
import { CommonModule } from '@angular/common';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { BaseGameInformation } from '@src/app/component/modify-base-game/modify-base-game.component';
import { LineupItem } from '@src/app/component/lineup-selector-person-item/lineup-selector-person-item.component';

type TabId = 'main' | 'opponent';

export type ModifyGameLineup = {
  mainStarting: LineupItem[];
  mainSubstitutes: LineupItem[];
  mainManagers: LineupItem[];
  opponentStarting: LineupItem[];
  opponenSubstitutes: LineupItem[];
  opponentManagers: LineupItem[];
}

@Component({
  selector: 'app-modify-game-lineups',
  imports: [CommonModule, I18nPipe, TabGroupComponent, TabItemComponent, LineupSelectorComponent],
  templateUrl: './modify-game-lineups.component.html',
  styleUrl: './modify-game-lineups.component.css'
})
export class ModifyGameLineupsComponent implements OnInit, OnDestroy {

  readonly input = input<Observable<Partial<BaseGameInformation>>>();
  readonly onGameLineupUpdated = output<ModifyGameLineup>();

  readonly activeTab$ = new BehaviorSubject<TabId>('main');

  readonly mainTabTitle = signal('');
  readonly mainTabIcon = signal<UiIconDescriptor | null>(null);

  readonly opponentTabTitle = signal('');
  readonly opponentTabIcon = signal<UiIconDescriptor | null>(null);

  private readonly mainClub = environment.mainClub;

  private readonly destroy$ = new Subject<void>();

  private readonly mainStarting = new Subject<LineupItem[]>();
  private readonly mainSubs = new Subject<LineupItem[]>();
  private readonly mainManagers = new Subject<LineupItem[]>();
  private readonly opponentStarting = new Subject<LineupItem[]>();
  private readonly opponentSubs = new Subject<LineupItem[]>();
  private readonly opponentManagers = new Subject<LineupItem[]>();

  ngOnInit(): void {
    this.mainTabTitle.set(this.mainClub.shortName);
    this.mainTabIcon.set({ type: 'club', content: this.mainClub.iconSmall });

    this.input()?.pipe(takeUntil(this.destroy$)).subscribe(baseGame => {
      this.opponentTabTitle.set(baseGame.opponentName ?? '');
      this.opponentTabIcon.set(baseGame.opponentIcon ?? null);
    });

    combineLatest([
      this.mainStarting,
      this.mainSubs,
      this.mainManagers,
      this.opponentStarting,
      this.opponentSubs,
      this.opponentManagers,
    ]).pipe(takeUntil(this.destroy$)).subscribe(combined => {
      this.onGameLineupUpdated.emit({
        mainStarting: combined[0],
        mainSubstitutes: combined[1],
        mainManagers: combined[2],
        opponentStarting: combined[3],
        opponenSubstitutes: combined[4],
        opponentManagers: combined[5],
      });
    });

    this.mainStarting.next([]);
    this.mainSubs.next([]);
    this.mainManagers.next([]);
    this.opponentStarting.next([]);
    this.opponentSubs.next([]);
    this.opponentManagers.next([]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onMainStartingUpdated(lineupItems: LineupItem[]) {
    this.mainStarting.next(lineupItems);
  }

  onMainSubtitutesUpdated(lineupItems: LineupItem[]) {
    this.mainSubs.next(lineupItems);
  }

  onMainManagersUpdated(lineupItems: LineupItem[]) {
    this.mainManagers.next(lineupItems);
  }

  onOpponentStartingUpdated(lineupItems: LineupItem[]) {
    this.opponentStarting.next(lineupItems);
  }

  onOpponentSubtitutesUpdated(lineupItems: LineupItem[]) {
    this.opponentSubs.next(lineupItems);
  }

  onOpponentManagersUpdated(lineupItems: LineupItem[]) {
    this.opponentManagers.next(lineupItems);
  }

}
