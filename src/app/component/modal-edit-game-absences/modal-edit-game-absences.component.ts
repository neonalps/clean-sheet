import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DetailedGame, GameAbsence } from '@src/app/model/game';
import { GameAbsenceService } from '@src/app/module/game-absence/service';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { ModalComponent } from "@src/app/component/modal/modal.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../button/button.component";

export type EditGameAbsencesPayload = {
  game: DetailedGame;
}

export type EditGameAbsencesSuccessPayload = {
  absences: GameAbsence[];
}

@Component({
  selector: 'app-modal-edit-game-absences',
  imports: [CommonModule, I18nPipe, ModalComponent, ButtonComponent],
  templateUrl: './modal-edit-game-absences.component.html'
})
export class ModalEditGameAbsencesComponent implements OnInit, OnDestroy {

  readonly input = signal<EditGameAbsencesPayload | null>(null);
  readonly currentAbsences = signal<GameAbsence[]>([]);

  private readonly gameAbsenceService = inject(GameAbsenceService);
  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.editGameAbsencesModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.input.set(payload);

        this.currentAbsences.set(payload.game.absences ?? []);
      });
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
      absences: [],
    } satisfies EditGameAbsencesSuccessPayload);
  }

}
