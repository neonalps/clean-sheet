import { Component, computed, inject, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SmallClub } from '@src/app/model/club';
import { SmallCompetition } from '@src/app/model/competition';
import { DetailedGame, GameManager, GamePlayer, GameStatus, ManagingRole, RefereeRole, TacticalFormation } from '@src/app/model/game';
import { UiIconDescriptor } from '@src/app/model/icon';
import { GameVenue } from '@src/app/model/venue';
import { GameResolver } from '@src/app/module/game/resolver';
import { ClubId, CompetitionId, DateString, GameId, PersonId, VenueId } from '@src/app/util/domain-types';
import { PATH_PARAM_GAME_ID } from '@src/app/util/router';
import { Subject, takeUntil } from 'rxjs';

export type UserProviderInput = {
  id: string;
  displayText: string;
}

export type ClubUiEntityModel = {
  id: ClubId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type ClubInputModel = {
  entity?: ClubUiEntityModel;
  userProvided?: UserProviderInput;
}

export type CompetitionUiEntityModel = {
  id: CompetitionId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type CompetitionInputModel = {
  entity?: CompetitionUiEntityModel;
  userProvided?: UserProviderInput;
}

export type PersonUiEntityModel = {
  id: PersonId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type PersonInputModel = {
  entity?: PersonUiEntityModel;
  userProvided?: UserProviderInput;
}

export type GamePlayerInputModel = {
  person: PersonInputModel;
  shirt: number;
  isCaptain?: boolean;
  positionGrid?: string;
}

export type GameManagerInputModel = {
  person: PersonInputModel;
  role: ManagingRole;
}

export type RefereeInputModel = {
  person: PersonInputModel;
  role: RefereeRole;
}

export type VenueUiEntityModel = {
  id: VenueId;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type VenueInputModel = {
  entity?: VenueUiEntityModel;
  userProvided?: UserProviderInput;
}

export type ModifyGameModel = {
  id?: GameId;
  kickoff?: DateString;
  status?: GameStatus;
  opponent?: ClubInputModel;
  competition?: CompetitionInputModel;
  competitionRound?: string;
  competitionStage?: string;
  leg?: number;
  previousLeg?: GameId;
  isHomeGame?: boolean;
  isNeutralGround?: boolean;
  isSoldOut?: boolean;
  attendance?: number;
  venue?: VenueInputModel;
  referees?: RefereeInputModel[];
  gamePlayersMain?: GamePlayerInputModel[];
  gamePlayersOpponent?: GamePlayerInputModel[];
  gameManagersMain?: GameManagerInputModel[];
  gameManagersOpponent?: GameManagerInputModel[];
  tacticalFormationMain?: TacticalFormation;
  tacticalFormationOpponent?: TacticalFormation;
}

@Component({
  selector: 'app-game-modify',
  imports: [],
  templateUrl: './game-modify.component.html',
  styleUrl: './game-modify.component.css'
})
export class ModifyGameComponent implements OnInit, OnDestroy {

  readonly model = signal<ModifyGameModel>({});
  
  readonly firstStageComplete: Signal<boolean> = computed(() => {
    const current = this.model();
    return current.competition?.entity !== undefined;
  });

  private readonly gameResolver = inject(GameResolver);
  private readonly route = inject(ActivatedRoute);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const gameId = Number(this.route.snapshot.paramMap.get(PATH_PARAM_GAME_ID));
    this.gameResolver.getById(gameId).pipe(takeUntil(this.destroy$)).subscribe(game => this.initializeModel(game));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeModel(game: DetailedGame | null) {
    console.log(game?.report.main);

    this.model.set({
      id: game?.id,
      kickoff: game?.kickoff,
      status: game?.status,
      opponent: this.mapOpponent(game?.opponent),
      competition: this.mapCompetition(game?.competition),
      competitionRound: game?.round,
      competitionStage: game?.stage,
      leg: game?.leg,
      previousLeg: game?.previousLeg,
      isHomeGame: game?.isHomeGame,
      isNeutralGround: game?.isNeutralGround,
      isSoldOut: game?.isSoldOut,
      attendance: game?.attendance,
      venue: this.mapVenue(game?.venue),
      gamePlayersMain: this.mapGamePlayers(game?.report.main.lineup),
      gamePlayersOpponent: this.mapGamePlayers(game?.report.opponent.lineup),
      gameManagersMain: this.mapGameManagers(game?.report.main.managers),
      gameManagersOpponent: this.mapGameManagers(game?.report.opponent.managers),
      tacticalFormationMain: game?.report.main.tacticalFormation,
      tacticalFormationOpponent: game?.report.opponent.tacticalFormation,
      referees: game?.report.referees.map(referee => ({ person: { entity: { id: referee.id, displayText: [referee.person.firstName, referee.person.lastName].join(' ') } }, role: referee.role }))
    });

    console.log('model', this.model());
  }

  private mapOpponent(opponent?: SmallClub): ClubInputModel {
    if (!opponent) {
      return {};
    }

    const clubEntity: ClubUiEntityModel = {
      id: opponent.id,
      displayText: opponent.name,
    };

    if (opponent.iconSmall) {
      clubEntity.icon = {
        type: 'club',
        content: opponent.iconSmall,
      }
    }

    return {
      entity: clubEntity,
    }
  }

  private mapCompetition(competition?: SmallCompetition): CompetitionInputModel {
    if (!competition) {
      return {};
    }

    const competitionEntity: CompetitionUiEntityModel = {
      id: competition.id,
      displayText: competition.name,
    };

    if (competition.iconSmall) {
      competitionEntity.icon = {
        type: 'competition',
        content: competition.iconSmall,
      }
    }

    return {
      entity: competitionEntity,
    }
  }

  private mapVenue(venue?: GameVenue): VenueInputModel {
    if (!venue) {
      return {};
    }

    const venueEntity: VenueUiEntityModel = {
      id: venue.id,
      displayText: venue.branding,
    };

    return {
      entity: venueEntity,
    }
  }

  private mapGamePlayers(gamePlayers?: GamePlayer[]): GamePlayerInputModel[] {
    if (!gamePlayers) {
      return [];
    }

    return gamePlayers.map(item => {
      const personEntity: PersonUiEntityModel = {
        id: item.player.id,
        displayText: [item.player.firstName, item.player.lastName].join(' '),
      };

      if (item.player.avatar) {
        personEntity.icon = {
          type: 'player',
          content: item.player.avatar,
        }
      }

      const mappedItem: GamePlayerInputModel = {
        person: {
          entity: personEntity,
        },
        shirt: item.shirt,
      };

      if (item.positionGrid) {
        mappedItem.positionGrid = item.positionGrid;
      }
      
      if (item.captain === true) {
        mappedItem.isCaptain = item.captain;
      }

      return mappedItem;
    });
  }

  private mapGameManagers(gameManagers?: GameManager[]): GameManagerInputModel[] {
    if (!gameManagers) {
      return [];
    }

    return gameManagers.map(item => {
      const personEntity: PersonUiEntityModel = {
        id: item.person.id,
        displayText: [item.person.firstName, item.person.lastName].join(' '),
      };

      if (item.person.avatar) {
        personEntity.icon = {
          type: 'player',
          content: item.person.avatar,
        }
      }

      const mappedItem: GameManagerInputModel = {
        person: {
          entity: personEntity,
        },
        role: item.role,
      };

      return mappedItem;
    });
  }

}
