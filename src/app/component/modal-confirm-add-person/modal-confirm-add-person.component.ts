import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '@src/app/component/button/button.component';

export type ConfirmAddPersonModalPayload = {
  personName: string;
};

@Component({
  selector: 'app-modal-confirm-add-person',
  imports: [ModalComponent, I18nPipe, ButtonComponent],
  templateUrl: './modal-confirm-add-person.component.html',
  styleUrl: './modal-confirm-add-person.component.css'
})
export class ModalConfirmAddPersonComponent implements OnInit, OnDestroy {

  readonly createPersonText = signal('');

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.confirmAddPersonModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.createPersonText.set(payload.personName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel() {
    this.modalService.onCancel();
    this.resetPersonText();
  }

  onConfirm() {
    this.modalService.onConfirm();
    this.resetPersonText();
  }

  private resetPersonText() {
    setTimeout(() => this.createPersonText.set(''), 200);
  }

}
