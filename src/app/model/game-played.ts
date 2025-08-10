export type GamePlayedFilterOptions = {
  competitionId?: string;
  opponentId?: string;
  seasonId?: number;
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