import { Component, input, OnInit, signal } from '@angular/core';
import { GameAbsence, GameAbsenceType } from '@src/app/model/game';
import { PersonCardComponent } from "@src/app/component/person-card/person-card.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { camelToKebab } from '@src/app/util/common';

type SuspensionCause = 'yellowCard' | 'redCard' | 'yellowRedCard';

type Suspension = {
  cause: SuspensionCause;
  quantity?: string;
}

@Component({
  selector: 'app-game-absence',
  imports: [CommonModule, PersonCardComponent, UiIconComponent],
  templateUrl: './game-absence.component.html'
})
export class GameAbsenceComponent implements OnInit {

  readonly absence = input.required<GameAbsence>();

  readonly suspension = signal<Suspension | null>(null);

  ngOnInit(): void {
    const absenceValue = this.absence();

    const absenceType = absenceValue.type;
    const absenceReasonParts = absenceValue.reason.split(":");

    switch (absenceType) {
      case GameAbsenceType.AtRisk:
      case GameAbsenceType.Suspended:
        this.suspension.set({ cause: camelToKebab(absenceReasonParts[0]) as SuspensionCause, quantity: absenceReasonParts[1]});
        break;
    }
  }

}
