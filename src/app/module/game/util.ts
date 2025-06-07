import { BasicGame, CardGameEvent, DetailedGame, GameEventType, GameManager, GamePlayer, GoalGameEvent, InjuryTimeGameEvent, PenaltyMissedGameEvent, ScoreTuple, SubstitutionGameEvent, UiCardGameEvent, UiGame, UiGameEvent, UiGameManager, UiGamePlayer, UiGoalGameEvent, UiInjuryTimeGameEvent, UiPenaltyMissedGameEvent, UiScoreBoard, UiScoreBoardItem, UiSubstitutionGameEvent, UiVarDecisionGameEvent, VarDecisionGameEvent } from "@src/app/model/game";
import { isDefined } from "@src/app/util/common";

export function getGameResult(game: BasicGame): ScoreTuple | null {
    if (isDefined(game.penaltyShootOut)) {
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

    // add half time period event
    // count how many events occurred before half time
    const eventsBeforeHalfTime = events.filter(event => Number(event.baseMinute) < 46).length;
    events.splice(eventsBeforeHalfTime, 0, {
        type: GameEventType.Period,
        id: 0,
        baseMinute: 'HT',
        additionalMinute: '',
        forMain: false,
        sortOrder: -1,
    })

    // add full time period event
    events.push({
        type: GameEventType.Period,
        id: 0,
        baseMinute: 'FT',
        additionalMinute: '',
        forMain: false,
        sortOrder: -1,
    })

    return {
        lineup: {
            main: {
                players: mainPlayers,
                managers: mainManagers,
            },
            opponent: {
                players: opponentPlayers,
                managers: opponentManagers,
            },
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
        events,
    }
}

export function splitGameMinute(minute: string): [string, string | undefined] {
    const stoppageTimeIndicatorPosition = minute.indexOf("+");
    if (stoppageTimeIndicatorPosition === -1) {
        return [minute, undefined];
    }

    return [minute.substring(0, stoppageTimeIndicatorPosition), minute.substring(stoppageTimeIndicatorPosition)];
}