import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { GameEventSelectorComponent } from "@src/app/component/game-event-selector/game-event-selector.component";
import { EditorGameEvent, EditorInputPerson } from '@src/app/module/game-event-editor/types';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { UuidSource } from '@src/app/util/uuid';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-game-event-editor',
  imports: [CommonModule, CdkDropList, GameEventSelectorComponent, I18nPipe],
  templateUrl: './game-event-editor.component.html',
  styleUrl: './game-event-editor.component.css'
})
export class GameEventEditorComponent implements OnInit {

  readonly gameEvents$ = new BehaviorSubject<Array<EditorGameEvent>>([]);

  readonly gamePersons: EditorInputPerson[] = [
    { personId: 1, name: 'Kjell Scherpen' },
    { personId: 10, name: 'William Böving' },
    { personId: 9, name: 'Otar Kiteishvili' },
  ]

  private readonly gameEvents: Array<EditorGameEvent> = [];

  private readonly uuidSource = inject(UuidSource);

  ngOnInit(): void {
    this.addItem();
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

  drop(event: CdkDragDrop<string[]>) {
     moveItemInArray(this.gameEvents, event.previousIndex, event.currentIndex);

     this.publishGameEvents();
  }

  private publishGameEvents() {
    console.log('events', this.gameEvents);
    this.gameEvents$.next(this.gameEvents);
  }

}
