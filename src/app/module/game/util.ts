import { BasicGame, CardGameEvent, DetailedGame, GameEventType, GameManager, GamePlayer, GoalGameEvent, InjuryTimeGameEvent, PenaltyMissedGameEvent, PenaltyShootOutGameEvent, ScoreTuple, SubstitutionGameEvent, TeamGameReport, UiCardGameEvent, UiGame, UiGameEvent, UiGameManager, UiGamePlayer, UiGoalGameEvent, UiInjuryTimeGameEvent, UiPenaltyMissedGameEvent, UiPenaltyShootOutGameEvent, UiSubstitutionGameEvent, UiTeamLineup, UiVarDecisionGameEvent, VarDecisionGameEvent } from "@src/app/model/game";
import { isDefined } from "@src/app/util/common";

export function getGameResult(game: BasicGame, includePso = true): ScoreTuple | null {
    if (isDefined(game.penaltyShootOut) && includePso === true) {
        return game.isHomeGame ? game.penaltyShootOut : [game.penaltyShootOut[1], game.penaltyShootOut[0]];
    }

    if (isDefined(game.afterExtraTime)) {
        return game.isHomeGame ? game.afterExtraTime : [game.afterExtraTime[1], game.afterExtraTime[0]];
    }

    if (isDefined(game.fullTime)) {
        return game.isHomeGame ? game.fullTime : [game.fullTime[1], game.fullTime[0]];
    }

    return null;
}


export function transformGoalMinute(minute: string, suffix: string): string {
    const result: string[] = [];

    if (minute.indexOf("+") < 0) {
        result.push(`${minute}${suffix}`);
    } else {
        const parts = minute.split("+");
        result.push(...[`${parts[0]}${suffix}`, '+', parts[1]]);
    }

    return result.join('');
}

export type GoalMinuteLocalizationOptions = { ownGoal: string, penalty: string, minuteSuffix: string };
export type GoalScoringBoardMinuteLocalizer = {
    localize: (goalGameEvent: GoalGameEvent, localizationOptions: GoalMinuteLocalizationOptions ) => string;
}

export type ScoreLocalizer = (score: ScoreTuple) => string;
export type MinuteLocalizer = (minute: string) => string;
export type OwnGoalLocalizer = () => string;
export type PenaltyLocalizer = () => string;

function convertToUiGamePlayer(item: GamePlayer, forMain: boolean): UiGamePlayer {
    return {
        gamePlayerId: item.id,
        forMain,
        personId: item.player.id,
        firstName: item.player.firstName,
        lastName: item.player.lastName,
        avatar: item.player.avatar,
        shirt: item.shirt,
        positionGrid: item.positionGrid,
    };
}

type GamePlayerGoals = { gamePlayerId: number, goals: string[] };

function convertToUiGameManager(item: GameManager, forMain: boolean): UiGameManager {
    return {
        gameManagerId: item.id,
        forMain,
        role: item.role,
        personId: item.person.id,
        firstName: item.person.firstName,
        lastName: item.person.lastName,
        avatar: item.person.avatar,
    }
}

export function convertToUiGame(game: DetailedGame, localizers: { score: ScoreLocalizer, minute: MinuteLocalizer, ownGoal: OwnGoalLocalizer, penalty: PenaltyLocalizer }): UiGame {
    const mainPlayers = game.report.main.lineup.map(item => convertToUiGamePlayer(item, true));
    const opponentPlayers = game.report.opponent.lineup.map(item => convertToUiGamePlayer(item, false));
    const mainManagers = game.report.main.managers.map(item => convertToUiGameManager(item, true));
    const opponentManagers = game.report.opponent.managers.map(item => convertToUiGameManager(item, false));

    const allPlayersMap: Map<number, UiGamePlayer> = new Map();
    [...mainPlayers, ...opponentPlayers].forEach(player => {
        allPlayersMap.set(player.gamePlayerId, player);
    });

    const allManagersMap: Map<number, UiGameManager> = new Map();
    [...mainManagers, ...opponentManagers].forEach(manager => {
        allManagersMap.set(manager.gameManagerId, manager);
    })

    const isHomeGame = game.isHomeGame;

    const mainGoalScorers: GamePlayerGoals[] = [];
    const opponentGoalScorers: GamePlayerGoals[] = [];

    const eventsBeforeHalfTime = game.report.events.filter(event => Number(splitGameMinute(event.minute)[0]) < 46).length;
    // we must add one to eventsBeforeFullTime because the half time event will be added as well
    const eventsBeforeExtraTime = game.report.events.filter(event => Number(splitGameMinute(event.minute)[0]) < 91).length + 1;

    const events: UiGameEvent[] = game.report.events.map(event => {
        const minute = splitGameMinute(event.minute);

        const baseEvent: UiGameEvent = {
            id: event.id,
            type: event.type,
            sortOrder: event.sortOrder,
            baseMinute: localizers.minute(minute[0]),
            additionalMinute: minute[1],
            forMain: true,          // will be overwritten by each event type
        };

        switch (event.type) {
            case GameEventType.Goal:
                const goalGameEvent = event as GoalGameEvent;
                const scoredBy = allPlayersMap.get(goalGameEvent.scoredBy) as UiGamePlayer;
                const goalForMain = goalGameEvent.ownGoal === true ? !scoredBy.forMain : scoredBy.forMain;

                const scoreBoardItem = [
                    localizers.minute(event.minute),
                    goalGameEvent.penalty === true ? localizers.penalty() : undefined,
                    goalGameEvent.ownGoal === true ? localizers.ownGoal() : undefined,
                ].filter(item => isDefined(item)).join(" ");

                if (goalForMain) {
                    const existing = mainGoalScorers.find(item => item.gamePlayerId === scoredBy.gamePlayerId);
                    if (existing) {
                        existing.goals.push(scoreBoardItem);
                    } else {
                        mainGoalScorers.push({ gamePlayerId: scoredBy.gamePlayerId, goals: [scoreBoardItem] });
                    }
                } else {
                    const existing = opponentGoalScorers.find(item => item.gamePlayerId === scoredBy.gamePlayerId);
                    if (existing) {
                        existing.goals.push(scoreBoardItem);
                    } else {
                        opponentGoalScorers.push({ gamePlayerId: scoredBy.gamePlayerId, goals: [scoreBoardItem] });
                    }
                }

                return {
                    ...baseEvent,
                    score: localizers.score(isHomeGame ? goalGameEvent.score : [goalGameEvent.score[1], goalGameEvent.score[0]]),
                    scoredBy,
                    assistBy: goalGameEvent.assistBy ? allPlayersMap.get(goalGameEvent.assistBy) as UiGamePlayer : undefined,
                    goalType: goalGameEvent.goalType,
                    penalty: goalGameEvent.penalty,
                    ownGoal: goalGameEvent.ownGoal,
                    directFreeKick: goalGameEvent.directFreeKick,
                    bicycleKick: goalGameEvent.bicycleKick,
                    forMain: goalForMain,
                } satisfies UiGoalGameEvent;
            case GameEventType.YellowCard:
            case GameEventType.YellowRedCard:
            case GameEventType.RedCard:
                const cardGameEvent = event as CardGameEvent;
                const cardAffectedPlayer = cardGameEvent.affectedPlayer ? allPlayersMap.get(cardGameEvent.affectedPlayer) as UiGamePlayer : undefined;
                const cardAffectedManager = cardGameEvent.affectedManager ? allManagersMap.get(cardGameEvent.affectedManager) as UiGameManager : undefined;
                return {
                    ...baseEvent,
                    cardType: event.type === GameEventType.YellowCard ? 'yellow' : event.type === GameEventType.YellowRedCard ? 'yellowRed' : 'red',
                    affectedPlayer: cardAffectedPlayer,
                    affectedManager: cardAffectedManager, 
                    reason: cardGameEvent.reason,
                    forMain: cardAffectedPlayer !== undefined ? cardAffectedPlayer.forMain : (cardAffectedManager as UiGameManager).forMain,
                    notOnPitch: cardGameEvent.notOnPitch === true,
                } satisfies UiCardGameEvent;
            case GameEventType.Substitution:
                const substitutionGameEvent = event as SubstitutionGameEvent;
                const playerOn = allPlayersMap.get(substitutionGameEvent.playerOn) as UiGamePlayer;
                const playerOff = allPlayersMap.get(substitutionGameEvent.playerOff) as UiGamePlayer;
                return {
                    ...baseEvent,
                    playerOn,
                    playerOff,
                    forMain: playerOn.forMain,
                    injured: substitutionGameEvent.injured === true,
                } satisfies UiSubstitutionGameEvent;
            case GameEventType.VarDecision:
                const varDecisionGameEvent = event as VarDecisionGameEvent;
                const varDecisionAffectedPlayer = allPlayersMap.get(varDecisionGameEvent.affectedPlayer) as UiGamePlayer;
                return {
                    ...baseEvent,
                    affectedPlayer: varDecisionAffectedPlayer,
                    decision: varDecisionGameEvent.decision,
                    reason: varDecisionGameEvent.reason,
                    forMain: varDecisionAffectedPlayer.forMain,
                } satisfies UiVarDecisionGameEvent;
            case GameEventType.PenaltyMissed:
                const penaltyMissedGameEvent = event as PenaltyMissedGameEvent;
                const takenByPlayer = allPlayersMap.get(penaltyMissedGameEvent.takenBy) as UiGamePlayer;
                const goalkeeperPlayer = allPlayersMap.get(penaltyMissedGameEvent.goalkeeper) as UiGamePlayer;
                return {
                    ...baseEvent,
                    takenBy: takenByPlayer,
                    goalkeeper: goalkeeperPlayer,
                    reason: penaltyMissedGameEvent.reason,
                    forMain: takenByPlayer.forMain,
                } satisfies UiPenaltyMissedGameEvent;
            case GameEventType.PenaltyShootOut:
                const penaltyShootOutGameEvent = event as PenaltyShootOutGameEvent;
                const psoTakenByPlayer = allPlayersMap.get(penaltyShootOutGameEvent.takenBy) as UiGamePlayer;
                const psoGoalkeeperPlayer = allPlayersMap.get(penaltyShootOutGameEvent.goalkeeper) as UiGamePlayer;
                return {
                    ...baseEvent,
                    score: localizers.score(isHomeGame ? penaltyShootOutGameEvent.score : [penaltyShootOutGameEvent.score[1], penaltyShootOutGameEvent.score[0]]),
                    takenBy: psoTakenByPlayer,
                    goalkeeper: psoGoalkeeperPlayer,
                    result: penaltyShootOutGameEvent.result,
                    forMain: psoTakenByPlayer.forMain,
                } satisfies UiPenaltyShootOutGameEvent;
            case GameEventType.InjuryTime:
                const injuryTimeGameEvent = event as InjuryTimeGameEvent;
                return {
                    ...baseEvent,
                    additionalMinutes: injuryTimeGameEvent.additionalMinutes,
                } satisfies UiInjuryTimeGameEvent;
            default:
                return baseEvent;
        }
    });

    // remove all PSO events (they must be all at the end) and move them to their own collection
    const psoGameEvents: UiGameEvent[] = [];
    const firstPsoGameEventIndex = events.findIndex(item => item.type === GameEventType.PenaltyShootOut);
    if (firstPsoGameEventIndex >= 0) {
        psoGameEvents.push(...(events.splice(firstPsoGameEventIndex) as UiPenaltyShootOutGameEvent[]));
    }

    // add half time period event
    events.splice(eventsBeforeHalfTime, 0, {
        type: GameEventType.Period,
        id: 0,
        baseMinute: 'HT',
        additionalMinute: '',
        forMain: false,
        sortOrder: -1,
    });

    // add extra time period event if necessary
    if (isDefined(game.afterExtraTime)) {
        events.splice(eventsBeforeExtraTime, 0, {
            type: GameEventType.Period,
            id: 0,
            baseMinute: 'ET',
            additionalMinute: '',
            forMain: false,
            sortOrder: -1,
        });
    }

    // add penalty shoot out period event if necessary
    if (isDefined(game.penaltyShootOut)) {
        events.push({
            type: GameEventType.Period,
            id: 0,
            baseMinute: 'PSO',
            additionalMinute: '',
            forMain: false,
            sortOrder: -1,
        });
    }

    const fullTimeEvent = {
        type: GameEventType.Period,
        id: 0,
        baseMinute: 'FT',
        additionalMinute: '',
        forMain: false,
        sortOrder: -1,
    };

    const lineupMain: UiTeamLineup = {
        players: mainPlayers,
        managers: mainManagers,
    };

    if (isDefined(game.report.main.tacticalFormation)) {
        lineupMain.tacticalFormation = game.report.main.tacticalFormation;
    }

    const lineupOpponent: UiTeamLineup = {
        players: opponentPlayers,
        managers: opponentManagers,
    };

    if (isDefined(game.report.opponent.tacticalFormation)) {
        lineupOpponent.tacticalFormation = game.report.opponent.tacticalFormation;
    }

    const uiGameResult: UiGame = {
        lineup: {
            main: lineupMain,
            opponent: lineupOpponent,
        },
        scoreBoard: {
            main: mainGoalScorers.map(item => {
                return {
                    player: allPlayersMap.get(item.gamePlayerId) as UiGamePlayer,
                    goalText: item.goals.join(", "),
                };
            }),
            opponent: opponentGoalScorers.map(item => {
                return {
                    player: allPlayersMap.get(item.gamePlayerId) as UiGamePlayer,
                    goalText: item.goals.join(", "),
                };
            }),
        },
        events: [
            ...events,
            ...psoGameEvents,
            fullTimeEvent,
        ]
    }

    return uiGameResult;
}

export function splitGameMinute(minute: string): [string, string | undefined] {
    const stoppageTimeIndicatorPosition = minute.indexOf("+");
    if (stoppageTimeIndicatorPosition === -1) {
        return [minute, undefined];
    }

    return [minute.substring(0, stoppageTimeIndicatorPosition), minute.substring(stoppageTimeIndicatorPosition)];
}