import { Component, Input } from '@angular/core';
import { RoundGamesComponent } from "@src/app/component/round-games/round-games.component";
import { RoundTableComponent } from "@src/app/component/round-table/round-table.component";
import { MatchdayDetails } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-round-information',
  imports: [I18nPipe, RoundGamesComponent, RoundTableComponent],
  templateUrl: './round-information.component.html',
  styleUrl: './round-information.component.css'
})
export class RoundInformationComponent {

  @Input() loading = true;
  @Input() matchdayDetails?: MatchdayDetails;

}
