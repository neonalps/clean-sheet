import { Tendency } from "./game";

export type GamePlayedFilterOptions = {
  nextPageKey?: string;
  onlyManager?: boolean;
  tendency?: Tendency;
  forMain?: boolean;
  competitionId?: string;
  opponentId?: string;
  seasonId?: string;
  gamesPlayed?: string;
  minutesPlayed?: string;
  goalsScored?: string;
  assists?: string;
  goalsConceded?: string;
  ownGoals?: number;
  isCaptain?: boolean;
  isStarting?: boolean;
  yellowCard?: boolean;
  yellowRedCard?: boolean;
  redCard?: boolean;
  shirt?: string;
  regulationPenaltiesTaken?: string;
  regulationPenaltiesScored?: string;
  regulationPenaltiesFaced?: string;
  regulationPenaltiesSaved?: string;
  psoPenaltiesTaken?: string;
  psoPenaltiesScored?: string;
  psoPenaltiesFaced?: string;
  psoPenaltiesSaved?: string;
}