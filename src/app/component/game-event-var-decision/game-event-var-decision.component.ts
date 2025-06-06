import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameEventComponent } from '@src/app/component/game-event/game-event.component';
import { UiVarDecisionGameEvent } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { isDefined } from '@src/app/util/common';

@Component({
  selector: 'app-game-event-var-decision',
  imports: [CommonModule, GameEventComponent, I18nPipe],
  templateUrl: './game-event-var-decision.component.html',
  styleUrl: './game-event-var-decision.component.css'
})
export class GameEventVarDecisionComponent {

  @Input() event!: UiVarDecisionGameEvent;

  constructor(private readonly translationService: TranslationService) {}

  getDecision(): string {
    return this.translationService.translate(`varDecision.${this.event.decision}`);
  }

  getPersonName(): string {
    return [this.event.affectedPlayer.firstName, this.event.affectedPlayer.lastName].filter(item => isDefined(item)).join(' ');
  }

}
