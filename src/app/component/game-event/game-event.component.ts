import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiGameEvent } from '@src/app/model/game';

@Component({
  selector: 'app-game-event',
  imports: [CommonModule],
  templateUrl: './game-event.component.html',
  styleUrl: './game-event.component.css'
})
export class GameEventComponent {

  @Input() event!: UiGameEvent;

}
