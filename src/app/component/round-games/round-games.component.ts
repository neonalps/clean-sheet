import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Fixture } from '@src/app/model/game';
import { ExternalGameOverviewComponent } from '@src/app/component/external-game-overview/external-game-overview.component';

@Component({
  selector: 'app-round-games',
  imports: [CommonModule, ExternalGameOverviewComponent],
  templateUrl: './round-games.component.html',
  styleUrl: './round-games.component.css'
})
export class RoundGamesComponent {

  @Input() loading = true;
  @Input() skeletonRowCount = 5;
  @Input() fixtures?: Fixture[];

  skeletonRows = [...Array(this.skeletonRowCount).keys()];

  onFixtureClicked(fixture: Fixture) {
    if (fixture.href) {
      window.open(fixture.href, '_blank');
    }
  }

}
