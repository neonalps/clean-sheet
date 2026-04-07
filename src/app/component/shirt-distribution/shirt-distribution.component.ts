import { Component, input, output } from '@angular/core';
import { ProgressBarComponent } from "@src/app/component/progress-bar/progress-bar.component";
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { ShirtDistributionItem } from '@src/app/model/stats';

@Component({
  selector: 'app-shirt-distribution',
  imports: [ProgressBarComponent],
  templateUrl: './shirt-distribution.component.html',
  styleUrl: './shirt-distribution.component.css'
})
export class ShirtDistributionComponent {

  readonly wornJerseys = input.required<Array<ShirtDistributionItem>>();

  readonly filterOptionsSelected = output<GamePlayedFilterOptions>();

  getShirtDistributionPercentage(value: number): number {
    const total = this.wornJerseys().reduce((acc, current) => (acc + current.count), 0);
    return value / total * 100;
  }

}
