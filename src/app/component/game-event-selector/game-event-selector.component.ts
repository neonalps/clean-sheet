import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Observable, of, Subject } from 'rxjs';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { GameEventType } from '@src/app/model/game';

@Component({
  selector: 'app-game-event-selector',
  imports: [CommonModule, I18nPipe, SelectComponent, UiIconComponent],
  templateUrl: './game-event-selector.component.html',
  styleUrl: './game-event-selector.component.css'
})
export class GameEventSelectorComponent {

  readonly pushGameEventType$ = new Subject<SelectOption>();
  readonly pushGameMinute$ = new Subject<string>();

  readonly currentGameEventType = signal<GameEventType | null>(null);

  @Output() readonly onRemove = new EventEmitter<number>();

  private readonly translationService = inject(TranslationService);

  getGameEventTypeOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'goal', name: this.translationService.translate(`gameEventType.goal`) },
      { id: 'substitution', name: this.translationService.translate(`gameEventType.substitution`) },
      { id: 'yellowCard', name: this.translationService.translate(`gameEventType.yellowCard`) },
      { id: 'yellowRedCard', name: this.translationService.translate(`gameEventType.yellowRedCard`) },
      { id: 'redCard', name: this.translationService.translate(`gameEventType.redCard`) },
      { id: 'injuryTime', name: this.translationService.translate(`gameEventType.injuryTime`) },
      { id: 'penaltyMissed', name: this.translationService.translate(`gameEventType.penaltyMissed`) },
      { id: 'varDecision', name: this.translationService.translate(`gameEventType.varDecision`) },
      { id: 'pso', name: this.translationService.translate(`gameEventType.pso`) },
    ]);
  }

  onGameEventTypeSelected(gameEventType: OptionId) {
    this.currentGameEventType.set(gameEventType as GameEventType);
  }

  onGameMinuteChange(event: Event): void {
    const minuteValue = getHtmlInputElementFromEvent(event).value;
    
  }

  removeClicked() {
    this.onRemove.next(1);
  }

}
