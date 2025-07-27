import { Component } from '@angular/core';
import { RoundGamesComponent } from "../round-games/round-games.component";
import { RoundTableComponent } from "../round-table/round-table.component";

@Component({
  selector: 'app-round-information',
  imports: [RoundGamesComponent, RoundTableComponent],
  templateUrl: './round-information.component.html',
  styleUrl: './round-information.component.css'
})
export class RoundInformationComponent {

}
