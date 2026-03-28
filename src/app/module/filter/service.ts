import { Injectable } from "@angular/core";
import { DetailedGame, GameEventType, GamePlayer, GoalGameEvent, Tendency } from "@src/app/model/game";
import { assertUnreachable, ensureNotNullish, isDefined, isNotDefined } from "@src/app/util/common";
import { CompetitionId } from "@src/app/util/domain-types";

type FilterItem<T extends string> = {
  id: string;
  type: T | null;
  value?: unknown;
}

export enum GameListFilterType {
  Competition = 'competition',
  ComeFromBehindWin = 'comeFromBehindWin',
  LossAfterLead = 'lossAfterLead',
};

export type GenericFilterItem = FilterItem<string>;
export type GameListFilterItem = FilterItem<GameListFilterType>;

@Injectable({
    providedIn: 'root'
})
export class FilterService {
    
    applyGamesFilter(games: DetailedGame[], filters: GameListFilterItem[]): DetailedGame[] {
        let filteredResult = games;

        for (const filter of filters) {
            const filterType = ensureNotNullish(filter.type);
            switch (filterType) {
                case GameListFilterType.ComeFromBehindWin:
                    filteredResult = filteredResult.filter(item => this.isComeFromBehindWin(item));
                    break;
                case GameListFilterType.LossAfterLead:
                    filteredResult = filteredResult.filter(item => this.isLossAfterLead(item));
                    break;
                case GameListFilterType.Competition:
                    throw new Error(`Not implemented yet`);
                default:
                    assertUnreachable(filterType);
            }
        }

        return filteredResult;
    }

    private isTendency(game: DetailedGame, tendency: Tendency): boolean {
        return game.resultTendency === tendency;
    }

    private isHomeGame(game: DetailedGame, isHome: boolean): boolean {
        return game.isHomeGame === isHome;
    }

    private winInExtraTime(game: DetailedGame): boolean {
        return isDefined(game.afterExtraTime) && (game.afterExtraTime[0] > game.afterExtraTime[1]);
    }

    private winInPso(game: DetailedGame): boolean {
        return isDefined(game.penaltyShootOut) && (game.penaltyShootOut[0] > game.penaltyShootOut[1]);
    }

    private isInCompetition(game: DetailedGame, competitionIds: CompetitionId[]): boolean {
        const effectiveCompetitionId = game.competition.parent?.id ?? game.competition.id;
        return competitionIds.includes(effectiveCompetitionId);
    }

    private isComeFromBehindWin(game: DetailedGame, behindByAtLeast = 1): boolean {
        return game.resultTendency === 'w' && isNotDefined(game.penaltyShootOut) && game.report.events.some(event => {
            if (event.type !== GameEventType.Goal) {
                return false;
            }

            const goalGameEvent = event as GoalGameEvent;
            return (goalGameEvent.score[0] - goalGameEvent.score[1]) <= (behindByAtLeast * -1);
        });
    }

    private isLossAfterLead(game: DetailedGame, leadByAtLeast = 1): boolean {
        return game.resultTendency === 'l' && isNotDefined(game.penaltyShootOut) && game.report.events.some(event => {
            if (event.type !== GameEventType.Goal) {
                return false;
            }

            const goalGameEvent = event as GoalGameEvent;
            return (goalGameEvent.score[0] - goalGameEvent.score[1]) >= leadByAtLeast;
        });
    }

    private isInjuryTimeWin(game: DetailedGame): boolean {
        return game.resultTendency === 'w' && isNotDefined(game.penaltyShootOut) && game.report.events.some(event => {
            if (event.type !== GameEventType.Goal) {
                return false;
            }

            const goalGameEvent = event as GoalGameEvent;

            const scoredByMainPlayer = this.findInLineup(goalGameEvent.scoredBy, game.report.main.lineup);

            return goalGameEvent.minute.startsWith('90+')
                && (goalGameEvent.score[0] - goalGameEvent.score[1]) === 1
                && ((scoredByMainPlayer && !goalGameEvent.ownGoal) || (!scoredByMainPlayer && goalGameEvent.ownGoal));
        });
    }

    private isInjuryTimeLoss(game: DetailedGame): boolean {
        return game.resultTendency === 'l' && isNotDefined(game.penaltyShootOut) && game.report.events.some(event => {
            if (event.type !== GameEventType.Goal) {
                return false;
            }

            const goalGameEvent = event as GoalGameEvent;

            const scoredByOpponentPlayer = this.findInLineup(goalGameEvent.scoredBy, game.report.opponent.lineup);

            return goalGameEvent.minute.startsWith('90+')
                && (goalGameEvent.score[0] - goalGameEvent.score[1]) === -1
                && ((scoredByOpponentPlayer && !goalGameEvent.ownGoal) || (!scoredByOpponentPlayer && goalGameEvent.ownGoal));
        });
    }

    private findInLineup(gamePlayerId: number, lineup: GamePlayer[]): GamePlayer | undefined {
        return lineup.find(gamePlayer => gamePlayer.id === gamePlayerId)
    }

}