import { SmallCompetition } from "@src/app/model/competition";
import { Season } from "@src/app/model/season";
import { PlayerBaseStats, PlayerSeasonStatsItemDto, PlayerStatsItemDto, UiPlayerStats } from "@src/app/model/stats";
import { CompetitionId, SeasonId } from "@src/app/util/domain-types";

export function getEmptyPlayerBaseStats(): PlayerBaseStats {
    return {
        gamesPlayed: 0,
        gamesStarted: 0,
        goalsScored: 0,
        assists: 0,
        ownGoals: 0,
        goalsConceded: 0,
        cleanSheets: 0,
        minutesPlayed: 0,
        yellowCards: 0,
        yellowRedCards: 0,
        redCards: 0,
        regulationPenaltiesTaken: 0,
        regulationPenaltiesScored: 0,
        regulationPenaltiesFaced: 0,
        regulationPenaltiesSaved: 0,
        psoPenaltiesTaken: 0,
        psoPenaltiesScored: 0,
        psoPenaltiesFaced: 0,
        psoPenaltiesSaved: 0,
    };
}

export function fromOptionalStatsDto(item: PlayerStatsItemDto): PlayerBaseStats {
    return {
        gamesPlayed: item.gamesPlayed ?? 0,
        gamesStarted: item.gamesStarted ?? 0,
        goalsScored: item.goalsScored ?? 0,
        assists: item.assists ?? 0,
        ownGoals: item.ownGoals ?? 0,
        goalsConceded: item.goalsConceded ?? 0,
        cleanSheets: item.cleanSheets ?? 0,
        minutesPlayed: item.minutesPlayed ?? 0,
        yellowCards: item.yellowCards ?? 0,
        yellowRedCards: item.yellowRedCards ?? 0,
        redCards: item.redCards ?? 0,
        regulationPenaltiesTaken: item.penaltiesTaken !== undefined ? item.penaltiesTaken[0] : 0,
        regulationPenaltiesScored: item.penaltiesTaken !== undefined ? item.penaltiesTaken[1] : 0,
        regulationPenaltiesFaced: item.penaltiesFaced !== undefined ? item.penaltiesFaced[0] : 0,
        regulationPenaltiesSaved: item.penaltiesFaced !== undefined ? item.penaltiesFaced[1] : 0,
        psoPenaltiesTaken: item.psoPenaltiesTaken !== undefined ? item.psoPenaltiesTaken[0] : 0,
        psoPenaltiesScored: item.psoPenaltiesTaken !== undefined ? item.psoPenaltiesTaken[1] : 0,
        psoPenaltiesFaced: item.psoPenaltiesFaced !== undefined ? item.psoPenaltiesFaced[0] : 0,
        psoPenaltiesSaved: item.psoPenaltiesFaced !== undefined ? item.psoPenaltiesFaced[1] : 0,
    };
}

export function combinePlayerBaseStats(first: PlayerBaseStats, second: PlayerBaseStats): PlayerBaseStats {
    return {
        gamesPlayed: first.gamesPlayed + second.gamesPlayed,
        gamesStarted: first.gamesStarted + second.gamesStarted,
        goalsScored: first.goalsScored + second.goalsScored,
        assists: first.assists + second.assists,
        ownGoals: first.ownGoals + second.ownGoals,
        goalsConceded: first.goalsConceded + second.goalsConceded,
        cleanSheets: first.cleanSheets + second.cleanSheets,
        minutesPlayed: first.minutesPlayed + second.minutesPlayed,
        yellowCards: first.yellowCards + second.yellowCards,
        yellowRedCards: first.yellowRedCards + second.yellowRedCards,
        redCards: first.redCards + second.redCards,
        regulationPenaltiesTaken: first.regulationPenaltiesTaken + second.regulationPenaltiesTaken,
        regulationPenaltiesScored: first.regulationPenaltiesScored + second.regulationPenaltiesScored,
        regulationPenaltiesFaced: first.regulationPenaltiesFaced + second.regulationPenaltiesFaced,
        regulationPenaltiesSaved: first.regulationPenaltiesSaved + second.regulationPenaltiesSaved,
        psoPenaltiesTaken: first.psoPenaltiesTaken + second.psoPenaltiesTaken,
        psoPenaltiesScored: first.psoPenaltiesScored + second.psoPenaltiesScored,
        psoPenaltiesFaced: first.psoPenaltiesFaced + second.psoPenaltiesFaced,
        psoPenaltiesSaved: first.psoPenaltiesSaved + second.psoPenaltiesSaved,
    };
}

export function getUiPlayerStats(seasonStats: Array<PlayerSeasonStatsItemDto>): UiPlayerStats {
    const seasons: Season[] = [];
    const competitions: SmallCompetition[] = [];

    let overall = getEmptyPlayerBaseStats();

    const bySeasonAndCompetition = new Map<SeasonId, Map<CompetitionId, PlayerBaseStats>>();

    for (const seasonItem of seasonStats) {
        seasons.push(seasonItem.season);
        bySeasonAndCompetition.set(seasonItem.season.id, new Map<CompetitionId, PlayerBaseStats>());

        for (const competitionItem of seasonItem.competitions) {
            if (!competitions.find(item => item.id === competitionItem.competition.id)) {
                competitions.push(competitionItem.competition);
            }

            for (const competitionSubItem of competitionItem.items) {
                const isSubCompetition = competitionSubItem.competition !== undefined;
                if (isSubCompetition && !competitions.find(item => item.id === competitionSubItem.competition?.id)) {
                    competitions.push(competitionSubItem.competition as SmallCompetition);
                }

                const currentCompetitionStats = fromOptionalStatsDto(competitionSubItem.stats);
                overall = combinePlayerBaseStats(overall, currentCompetitionStats);

                const effectiveCompetitionId = isSubCompetition ? (competitionSubItem.competition as SmallCompetition).id : competitionItem.competition.id;
                bySeasonAndCompetition.get(seasonItem.season.id)?.set(effectiveCompetitionId, currentCompetitionStats);
            }
        }
    }

    return {
        seasons,
        competitions,
        overall,
        bySeasonAndCompetition,
    }
}