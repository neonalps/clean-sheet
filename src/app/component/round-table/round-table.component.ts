import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-round-table',
  imports: [CommonModule],
  templateUrl: './round-table.component.html',
  styleUrl: './round-table.component.css'
})
export class RoundTableComponent {

  @Input() loading = true;
  @Input() skeletonRowCount = 10;

  skeletonRows = [...Array(this.skeletonRowCount).keys()];

}
