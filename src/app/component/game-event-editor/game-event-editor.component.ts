import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { GameEventSelectorComponent } from "@src/app/component/game-event-selector/game-event-selector.component";
import { EditorGameEvent } from '@src/app/module/game-event-editor/types';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { UuidSource } from '@src/app/util/uuid';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';
import { BaseGameInformation } from '@src/app/component/modify-base-game/modify-base-game.component';
import { ModifyGameLineup } from '@src/app/component/modify-game-lineups/modify-game-lineups.component';
import { getPersonName } from '@src/app/util/domain';
import { SelectOption } from '@src/app/component/select/option';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-game-event-editor',
  imports: [CommonModule, CdkDropList, GameEventSelectorComponent, I18nPipe],
  templateUrl: './game-event-editor.component.html',
  styleUrl: './game-event-editor.component.css'
})
export class GameEventEditorComponent implements OnInit, OnDestroy {

  readonly baseGame = input<Observable<Partial<BaseGameInformation>>>();
  readonly gameLineup = input<Observable<ModifyGameLineup>>();

  readonly onGameEventsUpdated = output<EditorGameEvent[]>();

  readonly gameEvents$ = new BehaviorSubject<Array<EditorGameEvent>>([]);

  readonly gamePersonOptions = signal<SelectOption[]>([]);
  readonly gamePersonOptions$ = toObservable(this.gamePersonOptions);

  private readonly currentBaseGame = signal<Partial<BaseGameInformation>>({});
  private readonly currentGameLineup = signal<ModifyGameLineup>({
    mainStarting: [],
    mainSubstitutes: [],
    mainManagers: [],
    opponentStarting: [],
    opponenSubstitutes: [],
    opponentManagers: [],
  });

  private readonly gameEvents: Array<EditorGameEvent> = [];

  private readonly uuidSource = inject(UuidSource);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.addItem();

    this.baseGame()?.pipe(takeUntil(this.destroy$)).subscribe(base => this.currentBaseGame.set(base));
    this.gameLineup()?.pipe(takeUntil(this.destroy$)).subscribe(lineup => {
      this.currentGameLineup.set(lineup);

      this.gamePersonOptions.set([
        ...lineup.mainStarting,
        ...lineup.mainSubstitutes,
        ...lineup.opponentStarting,
        ...lineup.opponenSubstitutes,
        ...lineup.mainManagers,
        ...lineup.opponentManagers,
      ].map(item => ({ id: item.person.personId, name: getPersonName(item.person) })));
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem() {
    this.gameEvents.push({ id: this.uuidSource.createUuid(), minute: '' });

    this.publishGameEvents();
  }

  onItemUpdate(updatedItem: EditorGameEvent) {
    const itemIndex = this.gameEvents.findIndex(item => item.id === updatedItem.id);
    if (itemIndex < 0) {
      return;
    }

    this.gameEvents[itemIndex] = {
      ...updatedItem,
    }

    this.publishGameEvents();
  }

  onItemRemove(itemId: string) {
    const itemIndex = this.gameEvents.findIndex(item => item.id === itemId);
    if (itemIndex < 0) {
      return;
    }

    this.gameEvents.splice(itemIndex, 1);

    this.publishGameEvents();
  }

  onItemDrop(event: CdkDragDrop<string[]>) {
     moveItemInArray(this.gameEvents, event.previousIndex, event.currentIndex);

     this.publishGameEvents();
  }

  private publishGameEvents() {
    this.gameEvents$.next(this.gameEvents);
    this.onGameEventsUpdated.emit(this.gameEvents);
  }

}
