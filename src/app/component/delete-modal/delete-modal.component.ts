import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '@src/app/module/i18n/translation.service';

export type DeleteModalPayload = {
  titleTextKey: string;
  contentTextKey: string;
}

@Component({
  selector: 'app-delete-modal',
  imports: [I18nPipe, ModalComponent, ButtonComponent, UiIconComponent],
  templateUrl: './delete-modal.component.html'
})
export class DeleteModalComponent implements OnInit, OnDestroy {

  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  private readonly currentPayload = signal<DeleteModalPayload | null>(null);
  readonly titleText = computed(() => {
    const key = this.currentPayload()?.titleTextKey;
    return key ? this.translationService.translate(key) : '';
  });

  readonly contentText = computed(() => {
    const key = this.currentPayload()?.contentTextKey;
    return key ? this.translationService.translate(key) : '';
  });

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.deleteModalPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel() {
    this.modalService.onCancel();

    setTimeout(() => this.resetModal(), 300);
  }

  onDelete() {
    this.modalService.onConfirm();

    setTimeout(() => this.resetModal(), 300);
  }

  private resetModal() {
    this.currentPayload.set(null);
  }

}
