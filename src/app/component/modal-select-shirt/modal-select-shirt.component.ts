import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { ensureNotNullish } from '@src/app/util/common';
import { PersonId } from '@src/app/util/domain-types';
import { Subject, takeUntil } from 'rxjs';

export type ShirtModalPayload = {
  personId: PersonId;
  shirt: number;
  unavailable: Set<number>;
};

@Component({
  selector: 'app-modal-select-shirt',
  imports: [CommonModule, ModalComponent, I18nPipe],
  templateUrl: './modal-select-shirt.component.html',
  styleUrl: './modal-select-shirt.component.css'
})
export class ModalSelectShirtComponent implements OnInit, OnDestroy {

  readonly currentSelectedShirt = signal<number>(0);
  readonly currentUnavailableShirts = signal<number[]>([]);

  private readonly currentPayload = signal<ShirtModalPayload | null>(null);

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.shirtModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);
        this.currentSelectedShirt.set(payload.shirt);
        this.currentUnavailableShirts.set(Array.from(payload.unavailable).filter(shirt => payload.shirt !== shirt));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectShirt(shirt: number) {
    this.modalService.onConfirm({ personId: ensureNotNullish(this.currentPayload()).personId, shirt });
    setTimeout(() => this.currentPayload.set(null), 200);
  }

  isUnavailable(shirt: number): boolean {
    return this.currentUnavailableShirts().indexOf(shirt) >= 0;
  }

}
