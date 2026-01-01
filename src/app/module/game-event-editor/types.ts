import { BookableOffence, ExpulsionReason, GameEventType, GoalType, PenaltyMissedReason, PsoResult, VarDecision, VarDecisionReason } from "@src/app/model/game";
import { PersonId } from "@src/app/util/domain-types";

export interface EditorInputPerson {
    personId: PersonId;
    name: string;
    forMain?: boolean;
    isManager?: boolean;
}

export interface EditorGameEvent {
    id: string;
    type?: GameEventType;
    minute: string;
}

export interface EditorGoalGameEvent extends EditorGameEvent {
    type: GameEventType.Goal;
    scoredBy: PersonId;
    goalType: GoalType;
    assistBy?: PersonId;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
}

export interface EditorSubstitutionGameEvent extends EditorGameEvent {
    type: GameEventType.Substitution;
    playerOn: PersonId;
    playerOff: PersonId;
    injured?: boolean;
}

export interface EditorYellowCardGameEvent extends EditorGameEvent {
    type: GameEventType.YellowCard;
    affectedPerson?: PersonId;
    reason: BookableOffence;
    notOnPitch?: boolean;
}

export interface EditorYellowRedCardGameEvent extends EditorGameEvent {
    type: GameEventType.YellowRedCard;
    affectedPerson?: PersonId;
    reason: BookableOffence;
    notOnPitch?: boolean;
}

export interface EditorRedCardGameEvent extends EditorGameEvent {
    type: GameEventType.RedCard;
    affectedPerson?: PersonId;
    reason: ExpulsionReason;
    notOnPitch?: boolean;
}

export interface EditorPenaltyMissedGameEvent extends EditorGameEvent {
    type: GameEventType.PenaltyMissed;
    takenBy: PersonId;
    reason: PenaltyMissedReason;
}

export interface EditorVarDecisionGameEvent extends EditorGameEvent {
    type: GameEventType.VarDecision;
    affectedPerson: PersonId;
    decision: VarDecision;
    reason: VarDecisionReason;
}

export interface EditorPsoGameEvent extends EditorGameEvent {
    type: GameEventType.PenaltyShootOut;
    takenBy: PersonId;
    result: PsoResult;
}

export interface EditorInjuryTimeGameEvent extends EditorGameEvent {
    type: GameEventType.InjuryTime;
    additionalMinutes: number;
}