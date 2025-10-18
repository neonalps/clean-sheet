import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { ensureNotNullish } from '@src/app/util/common';
import { PersonId } from '@src/app/util/domain-types';
import { Subject, takeUntil } from 'rxjs';
import { UiIconComponent } from "../ui-icon/icon.component";

export type ShirtModalPayload = {
  personId: PersonId;
  personName: string;
  avatar?: string;
  shirt: number;
  unavailable: Set<number>;
};

type Grid = GridRow[];

type GridRow = {
  columns: GridColumn[];
}

type GridColumn = {
  shirt: number;
  empty: boolean;
}

@Component({
  selector: 'app-modal-select-shirt',
  imports: [CommonModule, ModalComponent, I18nPipe, UiIconComponent],
  templateUrl: './modal-select-shirt.component.html',
  styleUrl: './modal-select-shirt.component.css'
})
export class ModalSelectShirtComponent implements OnInit, OnDestroy {

  readonly currentSelectedShirt = signal<number>(0);
  readonly currentPersonName = signal<string>('');
  readonly currentPersonAvatar = signal<string | null>(null);
  readonly currentStage = signal(0);
  readonly currentUnavailableShirts = signal<number[]>([]);
  readonly stageTwoGrid = signal<Grid>([]);

  private readonly currentPayload = signal<ShirtModalPayload | null>(null);

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.shirtModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);
        this.currentSelectedShirt.set(payload.shirt);
        this.currentPersonName.set(payload.personName);
        this.currentPersonAvatar.set(payload.avatar ?? null);
        this.currentUnavailableShirts.set(Array.from(payload.unavailable).filter(shirt => payload.shirt !== shirt));

        this.currentStage.set(payload.shirt > 0 ? 2 : 1);
        
        if (payload.shirt > 0) {
          this.selectNumberGroup(Math.floor(payload.shirt / 10) * 10);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectStage(stage: number) {
    this.currentStage.set(stage);
  }

  selectNumberGroup(groupStart: number) {
    this.stageTwoGrid.set([
      {
        columns: [
          { shirt: groupStart + 1, empty: false, },
          { shirt: groupStart + 2, empty: false, },
          { shirt: groupStart + 3, empty: false, },
          { shirt: groupStart + 4, empty: false, },
        ],
      },
      {
        columns: [
          { shirt: groupStart + 5, empty: false, },
          { shirt: groupStart + 6, empty: false, },
          { shirt: groupStart + 7, empty: false, },
          { shirt: groupStart + 8, empty: false, },
        ],
      },
      {
        columns: [
          { shirt: groupStart + 9, empty: false, },
          { shirt: groupStart !== 90 ? groupStart + 10 : 0, empty: groupStart === 90, },
          { shirt: 0, empty: true, },
          { shirt: 0, empty: true, },
        ],
      }
    ]);

    this.currentStage.set(2);
  }

  selectShirt(shirt: number) {
    this.modalService.onConfirm({ personId: ensureNotNullish(this.currentPayload()).personId, shirt });
    setTimeout(() => this.resetModal(), 200);
  }

  isUnavailable(shirt: number): boolean {
    return this.currentUnavailableShirts().indexOf(shirt) >= 0;
  }

  private resetModal() {
    this.currentPayload.set(null);
    this.currentSelectedShirt.set(0);
    this.currentPersonName.set('');
    this.currentPersonAvatar.set(null);
    this.currentUnavailableShirts.set([]);
    this.currentStage.set(0);
  }

}
