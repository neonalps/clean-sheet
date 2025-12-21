import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameEventSelectorComponent } from "@src/app/component/game-event-selector/game-event-selector.component";

@Component({
  selector: 'app-game-event-editor',
  imports: [CommonModule, CdkDropList, GameEventSelectorComponent],
  templateUrl: './game-event-editor.component.html',
  styleUrl: './game-event-editor.component.css'
})
export class GameEventEditorComponent {

  readonly gameEvents = [0, 1, 2, 3];

  addItem() {
    this.gameEvents.push(this.gameEvents.length);
  }

  onItemRemove(itemId: number) {
    this.gameEvents.splice(itemId, 1);
  }

  drop(event: CdkDragDrop<string[]>) {
     moveItemInArray(this.gameEvents, event.previousIndex, event.currentIndex);
     console.log('now', this.gameEvents);
  }

}
