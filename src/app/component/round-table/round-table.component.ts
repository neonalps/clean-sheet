import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { TablePosition } from '@src/app/model/game';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

@Component({
  selector: 'app-round-table',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './round-table.component.html'
})
export class RoundTableComponent {

  readonly loading = input(true);
  readonly skeletonRowCount = input(10);
  readonly table = input<TablePosition[]>();

  readonly effectiveTable = computed(() => this.table() ?? []);
  readonly skeletonRows = computed(() => [...Array(this.skeletonRowCount()).keys()])

}
