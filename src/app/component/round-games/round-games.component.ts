import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { Fixture } from '@src/app/model/game';
import { ExternalGameOverviewComponent } from '@src/app/component/external-game-overview/external-game-overview.component';

@Component({
  selector: 'app-round-games',
  imports: [CommonModule, ExternalGameOverviewComponent],
  templateUrl: './round-games.component.html'
})
export class RoundGamesComponent {

  readonly loading = input(true);
  readonly skeletonRowCount = input(5);
  readonly fixtures = input<Fixture[]>();

  readonly effectiveFixtures = computed(() => this.fixtures() ?? []);
  readonly skeletonRows = computed(() => [...Array(this.skeletonRowCount()).keys()]);

  onFixtureClicked(fixture: Fixture) {
    if (fixture.href) {
      window.open(fixture.href, '_blank');
    }
  }

}
