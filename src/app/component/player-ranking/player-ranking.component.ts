import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { ChipGroupComponent, ChipGroupInput } from '@src/app/component/chip-group/chip-group.component';
import { RankedPersonItem } from '@src/app/model/dashboard';
import { Person } from '@src/app/model/person';

@Component({
  selector: 'app-player-ranking',
  imports: [CommonModule, ChipGroupComponent, PlayerIconComponent],
  templateUrl: './player-ranking.component.html'
})
export class PlayerRankingComponent {

  readonly isLoading = input(true);
  readonly ranking = input<RankedPersonItem[]>([]);
  readonly competitionChips = input<ChipGroupInput>({ mode: 'single', chips: [] });
  readonly skeletonRowCount = input(5);

  readonly competitionChipsVisible = computed(() => this.competitionChips().chips.length > 0);

  readonly onCompetitionFilterChanged = output<string>();
  readonly onPlayerSelected = output<Person>();

  readonly skeletonRows = [...Array(this.skeletonRowCount).keys()];

  onCompetitionFilterUpdated(value: string | number | boolean) {
    this.onCompetitionFilterChanged.emit(value as string);
  }

  onPlayerClicked(person: Person) {
    this.onPlayerSelected.emit(person);
  }

}
