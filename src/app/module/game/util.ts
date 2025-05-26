import { BasicGame, ScoreTuple } from "@src/app/model/game";
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