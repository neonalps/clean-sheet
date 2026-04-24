import { Component, input } from '@angular/core';
import { GameAbsence } from '@src/app/model/game';
import { PersonCardComponent } from "@src/app/component/person-card/person-card.component";

@Component({
  selector: 'app-game-absence',
  imports: [PersonCardComponent],
  templateUrl: './game-absence.component.html'
})
export class GameAbsenceComponent {

  readonly absence = input.required<GameAbsence>();

}
