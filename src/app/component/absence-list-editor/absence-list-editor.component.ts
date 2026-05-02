import { Component, computed, input, OnDestroy } from '@angular/core';
import { GameAbsence, GameAbsenceType } from '@src/app/model/game';
import { SmallPerson } from '@src/app/model/person';
import { assertUnreachable } from '@src/app/util/common';
import { Subject } from 'rxjs';
import { GameAbsenceComponent } from "@src/app/component/game-absence/game-absence.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';

type AbsenceListEditorState = {
  injured: GameAbsence[];
  suspended: GameAbsence[];
  atRisk: GameAbsence[];
  other: GameAbsence[];
}

@Component({
  selector: 'app-absence-list-editor',
  imports: [GameAbsenceComponent, CommonModule, I18nPipe],
  templateUrl: './absence-list-editor.component.html',
})
export class AbsenceListEditorComponent implements OnDestroy {

  readonly absences = input.required<GameAbsence[]>();
  readonly activeSquad = input.required<SmallPerson[]>();

  readonly state = computed(() => {
    const editorState: AbsenceListEditorState = {
      injured: [],
      suspended: [],
      atRisk: [],
      other: [],
    };

    for (const absence of this.absences()) {
      switch (absence.type) {
        case GameAbsenceType.Injured:
          editorState.injured.push(absence);
          break;
        case GameAbsenceType.Suspended:
          editorState.suspended.push(absence);
          break;
        case GameAbsenceType.AtRisk:
          editorState.atRisk.push(absence);
          break;
        case GameAbsenceType.Exempt:
          editorState.other.push(absence);
          break;
        default:
          assertUnreachable(absence.type);
      }
    }

    return editorState;
  });

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
