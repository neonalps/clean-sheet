import { Component, input, OnInit } from '@angular/core';
import { GameAbsence } from '@src/app/model/game';
import { PersonCardComponent } from "@src/app/component/person-card/person-card.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

@Component({
  selector: 'app-game-absence',
  imports: [PersonCardComponent, UiIconComponent],
  templateUrl: './game-absence.component.html'
})
export class GameAbsenceComponent implements OnInit {

  readonly absence = input.required<GameAbsence>();

  ngOnInit(): void {
    console.log('absence is', this.absence())
  }

}
