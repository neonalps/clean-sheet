import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TablePosition } from '@src/app/model/game';
import { UiIconComponent } from "../ui-icon/icon.component";

@Component({
  selector: 'app-round-table',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './round-table.component.html',
  styleUrl: './round-table.component.css'
})
export class RoundTableComponent {

  @Input() loading = true;
  @Input() skeletonRowCount = 10;
  @Input() table?: TablePosition[];

  skeletonRows = [...Array(this.skeletonRowCount).keys()];

}
