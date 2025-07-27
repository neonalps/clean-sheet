import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-round-games',
  imports: [CommonModule],
  templateUrl: './round-games.component.html',
  styleUrl: './round-games.component.css'
})
export class RoundGamesComponent {

  @Input() loading = true;
  @Input() skeletonRowCount = 5;

  skeletonRows = [...Array(this.skeletonRowCount).keys()];

}
