import { BasicGame, DetailedGame, GameEventType, GoalGameEvent, ScoreTuple } from "@src/app/model/game";
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

export function transformGoalMinute(event: GoalGameEvent, options: GoalMinuteLocalizationOptions): string {
    const result: string[] = [];

    const minute = event.minute;
    if (minute.indexOf("+") < 0) {
        result.push(`${minute}${options.minuteSuffix}`);
    } else {
        const parts = minute.split("+");
        result.push(...[`${parts[0]}${options.minuteSuffix}`, '+', parts[1]]);
    }

    if (event.penalty === true) {
        result.push(` (${options.penalty})`);
    }

    if (event.ownGoal === true) {
        result.push(` (${options.ownGoal})`);
    }

    return result.join('');
}

type TemporaryGoalScoringBoard = {
    main: { gamePlayerId: number, playerName: string, goals: string[] }[],
    opponent: { gamePlayerId: number, playerName: string, goals: string[] }[],
}

export type GoalMinuteLocalizationOptions = { ownGoal: string, penalty: string, minuteSuffix: string };
export type GoalScoringBoardMinuteLocalizer = {
    localize: (goalGameEvent: GoalGameEvent, localizationOptions: GoalMinuteLocalizationOptions ) => string;
}

function getGoalScoringItem(goalEvent: GoalGameEvent, localizer: GoalScoringBoardMinuteLocalizer): string {
    return localizer.localize(goalEvent, { ownGoal: 'OG', penalty: 'P', minuteSuffix: `.` });
}

export type ScoringBoardItem = {
    gamePlayerId: number;
    text: string;
}
export type GameGoalScoringBoard = {
    main: ScoringBoardItem[];
    opponent: ScoringBoardItem[];
}
export function getGoalScoringBoard(game: DetailedGame, localizer: GoalScoringBoardMinuteLocalizer): GameGoalScoringBoard {
    const goalGameEvents = game.report.events.filter(item => item.type === GameEventType.Goal);
    if (goalGameEvents.length === 0) {
        return { main: [], opponent: [] };
    }

    const lineup = [...game.report.main.lineup, ...game.report.opponent.lineup];

    const tempBoard: TemporaryGoalScoringBoard = { main: [], opponent: [] };

    let scoreMain = 0;
    for (const goal of goalGameEvents) {
        const goalEvent = goal as GoalGameEvent;
        const scorer = lineup.find(item => item.id === goalEvent.scoredBy);
        if (scorer === undefined) {
            continue;
        }

        const goalScoringItem = getGoalScoringItem(goalEvent, localizer);
        const wasForMain = scoreMain !== goalEvent.score[0];
        if (wasForMain) {    
            const existing = tempBoard.main.find(item => item.gamePlayerId === goalEvent.scoredBy);
            if (existing) {
                existing.goals.push(goalScoringItem);
            } else {
                tempBoard.main.push({ gamePlayerId: goalEvent.scoredBy, playerName: scorer.player.lastName, goals: [goalScoringItem] });
            }
        } else {
            const existing = tempBoard.opponent.find(item => item.gamePlayerId === goalEvent.scoredBy);
            if (existing) {
                existing.goals.push(goalScoringItem);
            } else {
                tempBoard.opponent.push({ gamePlayerId: goalEvent.scoredBy, playerName: scorer.player.lastName, goals: [goalScoringItem] });
            }
        }
        
        scoreMain = goalEvent.score[0];
    }
    
    return {
        main: tempBoard.main.map(item => {
            return {
                gamePlayerId: item.gamePlayerId,
                text: [item.playerName, item.goals.join(', ')].join(' '),
            };
        }),
        opponent: tempBoard.opponent.map(item => {
            return {
                gamePlayerId: item.gamePlayerId,
                text: [item.playerName, item.goals.join(', ')].join(' '),
            }
        }),
    };
}
