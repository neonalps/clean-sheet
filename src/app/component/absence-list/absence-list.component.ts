import { Component, input, OnInit, signal } from '@angular/core';
import { GameAbsence, GameAbsenceType } from '@src/app/model/game';
import { GameAbsenceComponent } from "@src/app/component/game-absence/game-absence.component";
import { CommonModule } from '@angular/common';
import { assertUnreachable } from '@src/app/util/common';

@Component({
  selector: 'app-absence-list',
  imports: [CommonModule, GameAbsenceComponent],
  templateUrl: './absence-list.component.html'
})
export class AbsenceListComponent implements OnInit {

  readonly absences = input<GameAbsence[]>([]);

  readonly suspended = signal<GameAbsence[]>([]);
  readonly injured = signal<GameAbsence[]>([]);
  readonly atRisk = signal<GameAbsence[]>([]);
  readonly other = signal<GameAbsence[]>([]);

  ngOnInit(): void {
    for (const absence of this.absences()) {
      const absenceType = absence.type;
      switch (absenceType) {
        case GameAbsenceType.AtRisk:
          this.atRisk.update(value => [...value, absence]);
          break;
        case GameAbsenceType.Injured:
          this.injured.update(value => [...value, absence]);
          break;
        case GameAbsenceType.Suspended:
          this.suspended.update(value => [...value, absence]);
          break;
        case GameAbsenceType.Exempt:
          this.other.update(value => [...value, absence]);
          break;
        default:
          assertUnreachable(absenceType);
      }
    }
  }

}
