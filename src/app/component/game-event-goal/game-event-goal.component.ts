import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiGoalGameEvent } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { GameEventComponent } from "@src/app/component/game-event/game-event.component";
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

@Component({
  selector: 'app-game-event-goal',
  imports: [CommonModule, I18nPipe, GameEventComponent, UiIconComponent],
  templateUrl: './game-event-goal.component.html',
  styleUrl: './game-event-goal.component.css'
})
export class GameEventGoalComponent {

  @Input() event!: UiGoalGameEvent;

}
