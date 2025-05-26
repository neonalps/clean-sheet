import { SmallClub } from "./club";
import { SmallCompetition } from "./competition";
import { Person } from "./person";
import { Season } from "./season";
import { GameVenue } from "./venue";

export enum GameStatus {
    Finished = "Finished",
    Scheduled = "Scheduled",
    Ongoing = "Ongoing",
    Abandoned = "Abandoned",
    Postponed = "Postponed",
}

export type Tendency = 'w' | 'd' | 'l';

export type ScoreTuple = [number, number];

export interface BasicGame {
    id: number;
    kickoff: Date;
    opponent: SmallClub;
    season: Season;
    competition: SmallCompetition;
    round: string;
    isHomeGame: boolean;
    status: GameStatus;
    resultTendency: Tendency;
    fullTime?: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    penaltyShootOut?: ScoreTuple;
    attendance?: number;
    venue: GameVenue;
    leg?: number;
    previousLeg?: BasicGame;
    isNeutralGround?: boolean;
    scheduled?: Date;
}

export interface GamePlayer {
    id: number;
    player: Person;
    shirt: number;
    positionKey?: string;
    positionGrid?: number;
    goalsConceded?: number;
    goalsScored?: number;
    assists?: number;
    ownGoals?: number;
    captain?: boolean;
    starting?: boolean;
    yellowCard?: string;
    yellowRedCard?: string;
    redCard?: string;
    regulationPenaltiesTaken?: number;
    regulationPenaltiesScored?: number;
    regulationPenaltiesFaced?: number;
    regulationPenaltiesSaved?: number;
    psoPenaltiesTaken?: number;
    psoPenaltiesScored?: number;
    psoPenaltiesFaced?: number;
    psoPenaltiesSaved?: number;
    off?: string;
    on?: string;
}

export enum ManagingRole {
    HeadCoach = "headCoach",
    AssistantCoach = "assistantCoach",
}

export interface GameManager {
    id: number;
    person: Person;
    role: ManagingRole;
}

export interface TeamGameReport {
    lineup: GamePlayer[];
    managers: GameManager[];
}

export enum RefereeRole {
    AssistantReferee = "assistantReferee",
    AssistantVar = "avar",
    FourthOfficial = "fourthOfficial",
    Referee = "referee",
    Var = "var",
}

export interface GameReferee {
    id: number;
    person: Person;
    role: RefereeRole;
}

export enum GameEventType {
    ExtraTime = "extraTime",
    Goal = "goal",
    InjuryTime = "injuryTime",
    PenaltyMissed = "penaltyMissed",
    PenaltyShootOut = "pso",
    RedCard = "redCard",
    Substitution = "substitution",
    VarDecision = "varDecision",
    YellowCard = "yellowCard",
    YellowRedCard = "yellowRedCard",
}

export interface GameEvent {
    id: number;
    type: GameEventType;
    sortOrder: number;
    minute: string;
}

export interface GameReport {
    main: TeamGameReport;
    opponent: TeamGameReport;
    events: GameEvent[];
    referees: GameReferee[];
}

export interface DetailedGame extends BasicGame {
    report: GameReport,
}