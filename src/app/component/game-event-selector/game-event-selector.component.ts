import { Component, computed, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { SelectOption } from '@src/app/component/select/option';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getHtmlInputElementFromEvent } from '@src/app/util/common';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { BookableOffence, ExpulsionReason, GameEventType, GoalType, PenaltyMissedReason, PsoResult, VarDecision, VarDecisionReason } from '@src/app/model/game';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { EditorGameEvent, EditorGoalGameEvent, EditorInjuryTimeGameEvent, EditorPenaltyMissedGameEvent, EditorPsoGameEvent, EditorRedCardGameEvent, EditorSubstitutionGameEvent, EditorVarDecisionGameEvent, EditorYellowCardGameEvent, EditorYellowRedCardGameEvent } from '@src/app/module/game-event-editor/types';
import { PersonId } from '@src/app/util/domain-types';

@Component({
  selector: 'app-game-event-selector',
  imports: [CommonModule, CdkDrag, I18nPipe, SelectComponent, UiIconComponent],
  templateUrl: './game-event-selector.component.html',
  styleUrl: './game-event-selector.component.css'
})
export class GameEventSelectorComponent implements OnInit, OnDestroy {

  readonly editorGameEvent = input.required<EditorGameEvent>();
  readonly lineupPersonOptions = input<Observable<SelectOption[]>>();

  readonly pushAffectedPerson$ = new Subject<SelectOption>();
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

  private currentGameEvent!: EditorGameEvent;
  private currentGamePersons = signal<Array<SelectOption>>([]);

  readonly currentGameEventType = signal<GameEventType | null>(null);
  readonly currentGameMinute = signal<string>('');
  readonly directFreeKick = signal(false);
  readonly ownGoal = signal(false);
  readonly penalty = signal(false);
  readonly injured = signal(false);
  readonly notOnPitch = signal(false);
  readonly isDisabled = computed(() => {
    return this.currentGameEventType() === GameEventType.InjuryTime;
  });

  readonly onUpdate = output<EditorGameEvent>();
  readonly onRemove = output<void>();

  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.currentGameEvent = this.editorGameEvent();

    this.lineupPersonOptions()?.pipe(takeUntil(this.destroy$)).subscribe(personOptions => this.currentGamePersons.set(personOptions));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
    return of(this.currentGamePersons());
  }

  isGameMinuteVisible(): boolean {
    const gameEventType = this.currentGameEventType();
    return gameEventType === null || ![GameEventType.InjuryTime, GameEventType.PenaltyShootOut].includes(gameEventType);
  }

  onGameEventTypeSelected(option: SelectOption) {
    const gameEventType = option.id as GameEventType;
    this.currentGameEventType.set(gameEventType);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      type: gameEventType,
    }
  }

  onGameMinuteChanged(event: Event): void {
    const minuteValue = getHtmlInputElementFromEvent(event).value;
    this.currentGameMinute.set(minuteValue);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      minute: minuteValue,
    }

    this.publishCurrentGameEvent();
  }

  onGoalScoredBySelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      scoredBy: option.id as PersonId,
    } as EditorGoalGameEvent;

    this.publishCurrentGameEvent();
  }

  onGoalAssistBySelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      assistBy: option.id as PersonId,
    } as EditorGoalGameEvent;

    this.publishCurrentGameEvent();
  }

  onGoalTypeSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      goalType: option.id as GoalType,
    } as EditorGoalGameEvent;

    this.publishCurrentGameEvent();
  }

  onInjuryTimeChanged(event: Event): void {
    const injuryTimeValue = getHtmlInputElementFromEvent(event).value;
    this.publishInjuryTimeEventUpdate(Number(injuryTimeValue));
  }

  onPenaltyValueChanged(event: Event) {
    const penaltyValue = getHtmlInputElementFromEvent(event).checked;
    this.penalty.set(penaltyValue);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      penalty: penaltyValue,
    } as EditorGoalGameEvent;

    this.publishCurrentGameEvent();
  }

  onOwnGoalValueChange(event: Event) {
    const ownGoalValue = getHtmlInputElementFromEvent(event).checked;
    this.ownGoal.set(ownGoalValue);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      ownGoal: ownGoalValue,
    } as EditorGoalGameEvent;

    this.publishCurrentGameEvent();
  }

  onDirectFreeKickValueChange(event: Event) {
    const directFreeKickValue = getHtmlInputElementFromEvent(event).checked;
    this.directFreeKick.set(directFreeKickValue);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      directFreeKick: directFreeKickValue,
    } as EditorGoalGameEvent;

    this.publishCurrentGameEvent();
  }

  onNotOnPitchValueChange(event: Event) {
    const notOnPitchValue = getHtmlInputElementFromEvent(event).checked;
    this.notOnPitch.set(notOnPitchValue);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      notOnPitch: notOnPitchValue,
    } as EditorYellowCardGameEvent | EditorYellowRedCardGameEvent | EditorRedCardGameEvent;

    this.publishCurrentGameEvent();
  }

  onInjuredValueChange(event: Event) {
    const injuredValue = getHtmlInputElementFromEvent(event).checked;
    this.injured.set(injuredValue);

    this.currentGameEvent = {
      ...this.currentGameEvent,
      injured: injuredValue,
    } as EditorSubstitutionGameEvent;

    this.publishCurrentGameEvent();
  }

  onYellowCardReasonSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      reason: option.id as BookableOffence,
    } as EditorYellowCardGameEvent;

    this.publishCurrentGameEvent();
  }

  onYellowRedCardReasonSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      reason: option.id as BookableOffence,
    } as EditorYellowRedCardGameEvent;

    this.publishCurrentGameEvent();
  }

  onRedCardReasonSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      reason: option.id as ExpulsionReason,
    } as EditorRedCardGameEvent;

    this.publishCurrentGameEvent();
  }

  onPenaltyMissedReasonSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      reason: option.id as PenaltyMissedReason,
    } as EditorPenaltyMissedGameEvent;

    this.publishCurrentGameEvent();
  }

  onPenaltyTakenBySelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      takenBy: option.id,
    } as EditorPenaltyMissedGameEvent;

    this.publishCurrentGameEvent();
  }

  onPsoOutcomeSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      result: option.id as PsoResult,
    } as EditorPsoGameEvent;

    this.publishCurrentGameEvent();
  }

  onPsoTakenBySelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      takenBy: option.id,
    } as EditorPsoGameEvent;

    this.publishCurrentGameEvent();
  }

  onAffectedPersonSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      affectedPerson: option.id,
    } as EditorYellowCardGameEvent | EditorYellowRedCardGameEvent | EditorRedCardGameEvent;

    this.publishCurrentGameEvent();
  }

  onPlayerOffSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      playerOff: option.id,
    } as EditorSubstitutionGameEvent;

    this.publishCurrentGameEvent();
  }

  onPlayerOnSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      playerOn: option.id,
    } as EditorSubstitutionGameEvent;

    this.publishCurrentGameEvent();
  }

  onVarDecisionSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      decision: option.id as VarDecision,
    } as EditorVarDecisionGameEvent;

    this.publishCurrentGameEvent();
  }

  onVarDecisionReasonSelected(option: SelectOption) {
    this.currentGameEvent = {
      ...this.currentGameEvent,
      reason: option.id as VarDecisionReason,
    } as EditorVarDecisionGameEvent;

    this.publishCurrentGameEvent();
  }

  removeClicked() {
    this.onRemove.emit();
  }

  private publishCurrentGameEvent() {
    this.onUpdate.emit(this.currentGameEvent);
  }

  private publishInjuryTimeEventUpdate(additionalMinutes: number) {
    const injuryTimeEvent: EditorInjuryTimeGameEvent = {
      ...this.editorGameEvent(),
      type: GameEventType.InjuryTime,
      minute: this.currentGameMinute(),
      additionalMinutes,
    };

    this.currentGameEvent = {
      ...injuryTimeEvent,
    }

    this.publishCurrentGameEvent();
  }

}
