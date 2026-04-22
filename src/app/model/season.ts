import { DateString, GameId, SeasonTitleId } from "@src/app/util/domain-types";
import { SmallCompetition } from "./competition";

export interface Season {
    id: number;
    name: string;
    shortName: string;
    isCurrent?: boolean;
}

export interface SeasonTitle {
    id: SeasonTitleId;
    season: Season;
    competition: SmallCompetition;
    titleCount: number;
    victoryDate?: DateString;
    victoryGameId?: GameId;
}