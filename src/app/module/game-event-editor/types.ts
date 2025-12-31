import { GameEventType, GoalType } from "@src/app/model/game";
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

export interface EditorInjuryTimeGameEvent extends EditorGameEvent {
    type: GameEventType.InjuryTime;
    additionalMinutes: number;
}