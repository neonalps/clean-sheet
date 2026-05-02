import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DetailedGame, GameAbsence } from '@src/app/model/game';
import { GameAbsenceService } from '@src/app/module/game-absence/service';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { ModalComponent } from "@src/app/component/modal/modal.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { ensureNotNullish } from '@src/app/util/common';
import { AbsenceListComponent } from "@src/app/component/absence-list/absence-list.component";
import { SquadService } from '@src/app/module/squad/service';
import { SmallPerson } from '@src/app/model/person';
import { AbsenceListEditorComponent } from "../absence-list-editor/absence-list-editor.component";

export type EditGameAbsencesPayload = {
  game: DetailedGame;
}

export type EditGameAbsencesSuccessPayload = {
  absences: GameAbsence[];
}

@Component({
  selector: 'app-modal-edit-game-absences',
  imports: [CommonModule, I18nPipe, ModalComponent, ButtonComponent, AbsenceListEditorComponent],
  templateUrl: './modal-edit-game-absences.component.html'
})
export class ModalEditGameAbsencesComponent implements OnInit, OnDestroy {

  readonly input = signal<EditGameAbsencesPayload | null>(null);
  
  readonly activeSquadMembers = signal<SmallPerson[]>([]);
  readonly currentAbsences = signal<GameAbsence[]>([]);

  private readonly gameAbsenceService = inject(GameAbsenceService);
  private readonly modalService = inject(ModalService);
  private readonly squadService = inject(SquadService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.editGameAbsencesModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.input.set(payload);

        this.currentAbsences.set(payload.game.absences ?? []);
      });

    this.squadService.activeSquad$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(activeSquad => this.activeSquadMembers.set(activeSquad));

    this.squadService.fetch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel() {
    this.modalService.onCancel();
  }

  onConfirm() {
    this.modalService.onConfirm({
      absences: this.currentAbsences(),
    } satisfies EditGameAbsencesSuccessPayload);
  }

  loadPotentialAbsences() {
    this.gameAbsenceService.getPotentialAbsencesForGame(this.requireInput().game.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          this.currentAbsences.set(result.potential.map((item, idx) => ({ ...item, id: idx })));
        },
        error: err => {
          console.error(err);
        }
      })
  }

  private requireInput(): EditGameAbsencesPayload {
    return ensureNotNullish(this.input());
  }

}
