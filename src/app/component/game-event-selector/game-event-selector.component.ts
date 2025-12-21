import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Observable, of, Subject } from 'rxjs';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { GameEventType } from '@src/app/model/game';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game-event-selector',
  imports: [CommonModule, CdkDrag, I18nPipe, SelectComponent, UiIconComponent],
  templateUrl: './game-event-selector.component.html',
  styleUrl: './game-event-selector.component.css'
})
export class GameEventSelectorComponent {

  readonly pushGameEventType$ = new Subject<SelectOption>();
  readonly pushGameMinute$ = new Subject<string>();
  readonly pushGoalAssistBy$ = new Subject<SelectOption>();
  readonly pushGoalScoredBy$ = new Subject<SelectOption>();
  readonly pushGoalType$ = new Subject<SelectOption>();
  readonly pushInjuryTime$ = new Subject<string>();
  readonly pushYellowCardReason$ = new Subject<SelectOption>();
  readonly pushYellowRedCardReason$ = new Subject<SelectOption>();
  readonly pushRedCardReason$ = new Subject<SelectOption>();
  readonly pushPenaltyMissedReason$ = new Subject<SelectOption>();
  readonly pushPenaltyTakenBy$ = new Subject<SelectOption>();
  readonly pushPsoOutcome$ = new Subject<SelectOption>();
  readonly pushPsoTakenBy$ = new Subject<SelectOption>();
  readonly pushPlayerOff$ = new Subject<SelectOption>();
  readonly pushPlayerOn$ = new Subject<SelectOption>();
  readonly pushVarDecision$ = new Subject<SelectOption>();
  readonly pushVarDecisionReason$ = new Subject<SelectOption>();

  readonly currentGameEventType = signal<GameEventType | null>(null);
  readonly directFreeKick = signal(false);
  readonly ownGoal = signal(false);
  readonly penalty = signal(false);
  readonly injured = signal(false);
  readonly notOnPitch = signal(false);
  readonly isDisabled = computed(() => {
    return this.currentGameEventType() === GameEventType.InjuryTime;
  });

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

  getBookableOffenceReasonOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'foul', name: this.translationService.translate(`reason.foul`) },
      { id: 'unsportingBehaviour', name: this.translationService.translate(`reason.unsportingBehaviour`) },
      { id: 'dissent', name: this.translationService.translate(`reason.dissent`) },
      { id: 'handball', name: this.translationService.translate(`reason.handball`) },
      { id: 'dangerousPlay', name: this.translationService.translate(`reason.dangerousPlay`) },
      { id: 'unallowedFieldEntering', name: this.translationService.translate(`reason.unallowedFieldEntering`) },
    ]);
  }

  getExpulsionReasonOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'seriousFoulPlay', name: this.translationService.translate(`reason.seriousFoulPlay`) },
      { id: 'denialOfGoalScoringOpportunity', name: this.translationService.translate(`reason.denialOfGoalScoringOpportunity`) },
      { id: 'violentConduct', name: this.translationService.translate(`reason.violentConduct`) },
      { id: 'insult', name: this.translationService.translate(`reason.insult`) },
    ]);
  }

  getGoalTypeOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'left', name: this.translationService.translate(`goalType.left`) },
      { id: 'right', name: this.translationService.translate(`goalType.right`) },
      { id: 'head', name: this.translationService.translate(`goalType.head`) },
      { id: 'other', name: this.translationService.translate(`goalType.other`) },
    ]);
  }

  getPenaltyMissedReasonOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'saved', name: this.translationService.translate(`penaltyOutcome.saved`) },
      { id: 'wide', name: this.translationService.translate(`penaltyOutcome.wide`) },
      { id: 'high', name: this.translationService.translate(`penaltyOutcome.high`) },
      { id: 'crossbar', name: this.translationService.translate(`penaltyOutcome.crossbar`) },
      { id: 'post', name: this.translationService.translate(`penaltyOutcome.post`) },
    ]);
  }

  getPsoOutcomeOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'scored', name: this.translationService.translate(`penaltyOutcome.scored`) },
      { id: 'saved', name: this.translationService.translate(`penaltyOutcome.saved`) },
      { id: 'wide', name: this.translationService.translate(`penaltyOutcome.wide`) },
      { id: 'high', name: this.translationService.translate(`penaltyOutcome.high`) },
      { id: 'crossbar', name: this.translationService.translate(`penaltyOutcome.crossbar`) },
      { id: 'post', name: this.translationService.translate(`penaltyOutcome.post`) },
    ]);
  }

  getVarDecisionOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'goal', name: this.translationService.translate(`varDecision.goal`) },
      { id: 'penalty', name: this.translationService.translate(`varDecision.penalty`) },
      { id: 'noGoal', name: this.translationService.translate(`varDecision.noGoal`) },
      { id: 'penaltyCancelled', name: this.translationService.translate(`varDecision.penaltyCancelled`) },
      { id: 'yellowCardOverturned', name: this.translationService.translate(`varDecision.yellowCardOverturned`) },
      { id: 'goalConfirmed', name: this.translationService.translate(`varDecision.goalConfirmed`) },
      { id: 'penaltyConfirmed', name: this.translationService.translate(`varDecision.penaltyConfirmed`) },
      { id: 'noGoalConfirmed', name: this.translationService.translate(`varDecision.noGoalConfirmed`) },
      { id: 'noPenaltyConfirmed', name: this.translationService.translate(`varDecision.noPenaltyConfirmed`) },
    ]);
  }

  getVarDecisionReasonOptions(): Observable<SelectOption[]> {
    return of([
      { id: 'offside', name: this.translationService.translate(`varDecisionReason.offside`) },
      { id: 'foul', name: this.translationService.translate(`varDecisionReason.foul`) },
      { id: 'handball', name: this.translationService.translate(`varDecisionReason.handball`) },
      { id: 'noOffside', name: this.translationService.translate(`varDecisionReason.noOffside`) },
      { id: 'noFoul', name: this.translationService.translate(`varDecisionReason.noFoul`) },
      { id: 'noHandball', name: this.translationService.translate(`varDecisionReason.noHandball`) },
      { id: 'ballOutOfPlay', name: this.translationService.translate(`varDecisionReason.ballOutOfPlay`) },
      { id: 'outsidePenaltyArea', name: this.translationService.translate(`varDecisionReason.outsidePenaltyArea`) },
      { id: 'encroachment', name: this.translationService.translate(`varDecisionReason.encroachment`) },
    ]);
  }

  getGamePlayerOptions(): Observable<SelectOption[]> {
    return of([]);
  }

  isGameMinuteVisible(): boolean {
    const gameEventType = this.currentGameEventType();
    return gameEventType === null || ![GameEventType.InjuryTime, GameEventType.PenaltyShootOut].includes(gameEventType);
  }

  onGameEventTypeSelected(gameEventType: OptionId) {
    this.currentGameEventType.set(gameEventType as GameEventType);
  }

  onGameMinuteChange(event: Event): void {
    const minuteValue = getHtmlInputElementFromEvent(event).value;
    
  }

  onGoalScoredBySelected(scoredBy: OptionId) {
    
  }

  onGoalAssistBySelected(assistBy: OptionId) {
    
  }

  onGoalTypeSelected(goalType: OptionId) {
    
  }

  onInjuryTimeChange(event: Event): void {
    const injuryTimeValue = getHtmlInputElementFromEvent(event).value;
    
  }

  onOwnGoalValueChange(newValue: boolean) {

  }

  onYellowCardReasonSelected(reason: OptionId) {
    
  }

  onYellowRedCardReasonSelected(reason: OptionId) {
    
  }

  onRedCardReasonSelected(reason: OptionId) {
    
  }

  onPenaltyMissedReasonSelected(reason: OptionId) {
    
  }

  onPenaltyTakenBySelected(takenBy: OptionId) {
    
  }

  onPsoOutcomeSelected(takenBy: OptionId) {
    
  }

  onPsoTakenBySelected(takenBy: OptionId) {
    
  }

  onPlayerOffSelected(reason: OptionId) {
    
  }

  onPlayerOnSelected(reason: OptionId) {
    
  }

  onVarDecisionSelected(decision: OptionId) {
    
  }

  onVarDecisionReasonSelected(decisionReason: OptionId) {
    
  }

  removeClicked() {
    this.onRemove.next(1);
  }

}
