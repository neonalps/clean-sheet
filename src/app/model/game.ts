import { DateString } from "../util/domain-types";
import { ClubInput, SmallClub } from "./club";
import { CompetitionInput, SmallCompetition } from "./competition";
import { DetailedPerson, Person, PersonInput } from "./person";
import { Season } from "./season";
import { GameVenue, VenueInput } from "./venue";

export enum GameStatus {
    Finished = "Finished",
    Scheduled = "Scheduled",
    Ongoing = "Ongoing",
    Abandoned = "Abandoned",
    Postponed = "Postponed",
}

export type CardType = 'yellow' | 'red' | 'yellowRed';

export type Tendency = 'w' | 'd' | 'l';

export type ScoreTuple = [number, number];

export interface CreateGame {
    kickoff: DateString;
    opponent: ClubInput;
    competition: CompetitionInput;
    competitionRound: string;
    competitionStage?: string;
    isHomeGame: boolean;
    status: GameStatus;
    venue: VenueInput;
    attendance?: number;
    isNeutralGround?: boolean;
    isPractice?: boolean;
    isSoldOut?: boolean;
    lineupMain: CreateGamePlayer[];
    lineupOpponent: CreateGamePlayer[];
    managersMain: CreateGameManager[];
    managersOpponent: CreateGameManager[];
    events: CreateGameEvent[];
    referees: CreateGameReferee[];
    leg?: number;
    previousLeg?: GameInput;
}

export interface BasicGame {
    id: number;
    kickoff: string;
    opponent: SmallClub;
    season: Season;
    competition: SmallCompetition;
    round: string;
    stage?: string;
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
    previousLeg?: number;
    isSoldOut?: boolean;
    isNeutralGround?: boolean;
    scheduled?: Date;
    titleWinningGame?: boolean;
    titleCount?: number;
    victoryGameText?: string;
}

export interface GameInput {
    gameId?: number;
}

export interface GamePlayer {
    id: number;
    player: Person;
    shirt: number;
    positionKey?: string;
    positionGrid?: string;
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

export enum PsoResult {
    Goal = "goal",
    Saved = "saved",
    Post = "post",
    Crossbar = "crossbar",
    Wide = "wide",
    High = "high",
}

export enum ManagingRole {
    HeadCoach = "headCoach",
    AssistantCoach = "assistantCoach",
}

export type PenaltyMissedReason = 'wide' | 'high' | 'post' | 'crossbar' | 'saved';

export type VarDecision = 'goal' | 'noGoal' | 'penalty' | 'penaltyCancelled' | 'yellowCardOverturned' | 'noPenaltyConfirmed';

export type VarDecisionReason = 'offside' | 'foul' | 'handball' | 'ballOutOfPlay';

export interface GameManager {
    id: number;
    person: Person;
    role: ManagingRole;
    yellowCard?: string;
    yellowRedCard?: string;
    redCard?: string;
}

export interface TeamGameReport {
    lineup: GamePlayer[];
    managers: GameManager[];
    tacticalFormation?: TacticalFormation;
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
    person: DetailedPerson;
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
    Period = "period",
}

export type ExpulsionReason = 'violentConduct' | 'denialOfGoalScoringOpportunity' | 'professionalFoul' | 'argument' | 'seriousFoulPlay';

export enum BookableOffence {
    DangerousPlay = 'dangerousPlay',
    DenialOfGoalScoringOpportunity = 'denialOfGoalScoringOpportunity',
    Dissent = "dissent",
    Foul = "foul",
    Handball = "handball",
    Other = "other",
    UnsportingBehavious = "unsportingBehaviour",
};

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

export type GoalType = 'left' | 'right' | 'head' | 'other' | 'unknown';

export type TacticalFormation = '442-diamond' | '4231' | '433';

export interface GoalGameEvent extends GameEvent {
    scoredBy: number;
    assistBy?: number;
    score: ScoreTuple;
    goalType: GoalType;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
}

export interface CardGameEvent extends GameEvent {
    affectedPlayer?: number;
    affectedManager?: number;
    notOnPitch?: boolean;
    reason: string;
}

export interface SubstitutionGameEvent extends GameEvent {
    playerOn: number;
    playerOff: number;
    injured?: boolean;
}

export interface VarDecisionGameEvent extends GameEvent {
    affectedPlayer: number;
    decision: string;
    reason: string;
}

export interface PenaltyMissedGameEvent extends GameEvent {
    takenBy: number;
    goalkeeper: number;
    reason: string;
}

export interface PenaltyShootOutGameEvent extends GameEvent {
    score: ScoreTuple;
    takenBy: number;
    goalkeeper: number;
    result: PsoResult;
}

export interface InjuryTimeGameEvent extends GameEvent {
    additionalMinutes: number;
}

export interface UiPerson {
    personId: number;
    firstName: string;
    lastName: string;
    avatar?: string;
}

export interface UiGamePlayer extends UiPerson {
    gamePlayerId: number;
    forMain: boolean;
    shirt: number;
    positionGrid?: string;
    captain?: boolean;
    yellowCard?: string;
    yellowRedCard?: string;
    redCard?: string;
    on?: string;
    off?: string;
}

export interface UiGameManager extends UiPerson {
    gameManagerId: number;
    forMain: boolean;
    role: ManagingRole;
    yellowCard?: string;
    yellowRedCard?: string;
    redCard?: string;
}

export type UiScoreBoardItem = {
    player: UiGamePlayer;
    goalText: string;
}

export type UiScoreBoard = {
    main: UiScoreBoardItem[];
    opponent: UiScoreBoardItem[];
}

export type UiPersonItem = {
  personId: number;
  firstName?: string;
  lastName: string;
  avatar?: string;
  shirt?: number;
}

export type UiTeamLineup = {
    players: UiGamePlayer[];
    managers: UiGameManager[];
    tacticalFormation?: TacticalFormation;
}
export type UiLineup = {
    main: UiTeamLineup,
    opponent: UiTeamLineup,
}

export type UiGame = {
    scoreBoard: UiScoreBoard;
    events: UiGameEvent[];
    lineup: UiLineup;
}

export interface UiGameEvent {
    id: number;
    baseMinute: string;
    additionalMinute: string | undefined;
    sortOrder: number;
    type: GameEventType;
    forMain: boolean;
}

export interface UiGoalGameEvent extends UiGameEvent {
    score: string;
    scoredBy: UiGamePlayer,
    assistBy?: UiGamePlayer,
    goalType: GoalType;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
}

export interface UiCardGameEvent extends UiGameEvent {
    cardType: CardType;
    affectedPlayer?: UiGamePlayer;
    affectedManager?: UiGameManager;
    notOnPitch: boolean;
    reason: string;
}

export interface UiSubstitutionGameEvent extends UiGameEvent {
    playerOn: UiGamePlayer;
    playerOff: UiGamePlayer;
    injured: boolean;
}

export interface UiVarDecisionGameEvent extends UiGameEvent {
    affectedPlayer: UiGamePlayer;
    decision: string;
    reason: string;
}

export interface UiPenaltyMissedGameEvent extends UiGameEvent {
    takenBy: UiGamePlayer;
    goalkeeper: UiGamePlayer;
    reason: string;
}

export interface UiPenaltyShootOutGameEvent extends UiGameEvent {
    score: string;
    takenBy: UiGamePlayer;
    goalkeeper: UiGamePlayer;
    result: PsoResult;
}

export interface UiInjuryTimeGameEvent extends UiGameEvent {
    additionalMinutes: number;
}

export interface CreateGamePlayer {
    sortOrder: number;
    person: PersonInput;
    shirt: number;
    forMain: boolean;
    isStarting: boolean;
    isCaptain: boolean;
    positionKey?: string;
    positionGrid?: number;
}

export interface CreateGameManager {
    sortOrder: number;
    person: PersonInput;
    forMain: boolean;
    role: ManagingRole;
}

export interface CreateGameEvent {
    type: GameEventType;
    sortOrder: number;
    minute: string;
}

export interface CreateGoalGameEvent extends CreateGameEvent {
    type: GameEventType.Goal;
    scoredBy: PersonInput;
    assistBy?: PersonInput;
    goalType: GoalType;
    penalty: boolean;
    ownGoal: boolean;
    directFreeKick: boolean;
    bicycleKick: boolean;
}

export interface CreateInjuryTimeGameEvent extends CreateGameEvent {
    type: GameEventType.InjuryTime;
    additionalMinutes: number;
}

export interface CreatePenaltyMissedGameEvent extends CreateGameEvent {
    type: GameEventType.PenaltyMissed;
    reason: PenaltyMissedReason;
    takenBy: PersonInput;
}

export interface CreatePenaltyShootOutGameEvent extends CreateGameEvent {
    type: GameEventType.PenaltyShootOut;
    takenBy: PersonInput;
    result: PsoResult;
}

export interface CreateRedCardGameEvent extends CreateGameEvent {
    type: GameEventType.RedCard;
    affectedPlayer?: PersonInput;
    affectedManager?: PersonInput;
    reason?: ExpulsionReason;
    notOnPitch?: boolean;
}

export interface CreateSubstitutionGameEvent extends CreateGameEvent {
    type: GameEventType.Substitution;
    playerOn: PersonInput;
    playerOff: PersonInput;
    injured?: boolean;
}

export interface CreateVarDecisionGameEvent extends CreateGameEvent {
    type: GameEventType.VarDecision;
    decision: VarDecision;
    reason: VarDecisionReason;
    affectedPlayer: PersonInput;
}

export interface CreateYellowCardGameEvent extends CreateGameEvent {
    type: GameEventType.YellowCard;
    affectedPlayer?: PersonInput;
    affectedManager?: PersonInput;
    reason?: BookableOffence;
    notOnPitch?: boolean;
}

export interface CreateYellowRedCardGameEvent extends CreateGameEvent {
    type: GameEventType.YellowRedCard;
    affectedPlayer?: PersonInput;
    affectedManager?: PersonInput;
    reason?: BookableOffence;
    notOnPitch?: boolean;
}

export interface CreateGameReferee {
    sortOrder: number;
    person: PersonInput;
    role: RefereeRole;
}

export interface MatchdayDetails {
    competition: SmallCompetition;
    competitionRound: string;
    fixtures?: Fixture[];
    table?: TablePosition[];
}

export interface Fixture {
    status: GameStatus;
    kickoff: DateString;
    home: SmallClub;
    away: SmallClub;
    fullTime?: ScoreTuple;
    halfTime?: ScoreTuple;
    afterExtraTime?: ScoreTuple;
    afterPenaltyShootOut?: ScoreTuple;
    href?: string;
}

export interface TablePosition {
    position: number;
    club: SmallClub;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    gamesPlayed: number;
    wins: number;
    draws: number;
    defeats: number;
}

export interface ImportGameResponse {
    success: boolean;
    error?: string;
}