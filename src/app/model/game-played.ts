export type GamePlayedFilterOptions = {
  nextPageKey?: string;
  competitionId?: string;
  opponentId?: string;
  seasonId?: string;
  gamesPlayed?: string;
  minutesPlayed?: string;
  goalsScored?: string;
  assists?: string;
  goalsConceded?: number;
  ownGoals?: number;
  isCaptain?: boolean;
  isStarting?: boolean;
  yellowCard?: boolean;
  yellowRedCard?: boolean;
  redCard?: boolean;
  regulationPenaltiesTaken?: number;
  regulationPenaltiesScored?: number;
  regulationPenaltiesFaced?: number;
  regulationPenaltiesSaved?: number;
  psoPenaltiesTaken?: number;
  psoPenaltiesScored?: number;
  psoPenaltiesFaced?: number;
  psoPenaltiesSaved?: number;
}