import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BasicGame } from '@src/app/model/game';
import { getGameResult } from '@src/app/module/game/util';
import { SmallClubComponent } from '@src/app/component/small-club/small-club.component';
import { SmallClub } from '@src/app/model/club';
import { isDefined } from '@src/app/util/common';

@Component({
  selector: 'app-game-overview',
  imports: [CommonModule, SmallClubComponent],
  templateUrl: './game-overview.component.html',
  styleUrl: './game-overview.component.css'
})
export class GameOverviewComponent {

  @Input() game!: BasicGame;
  @Input() mainClub!: SmallClub;

  getHomeTeam(): SmallClub {
    return this.game.isHomeGame ? this.mainClub : this.game.opponent;
  }

  getAwayTeam(): SmallClub {
    return this.game.isHomeGame ? this.game.opponent : this.mainClub;
  }

  getCompetitionName(): string {
    const parts: string[] = [];
    if (isDefined(this.game.competition.parent)) {
      parts.push(this.game.competition.parent.shortName);
    }

    parts.push(this.game.competition.shortName);

    return parts.join(' · ');
  }

  getResult(): string {
    const tuple = getGameResult(this.game);
    
    return tuple !== null ? tuple.join(":") : "-";
  }

  getResultTendencyClass(): string {
    return `result-tendency-${this.game.resultTendency}`;
  }

}
