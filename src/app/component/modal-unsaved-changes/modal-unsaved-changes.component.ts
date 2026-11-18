import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { TranslationService } from '@src/app/module/i18n/translation.service';

export type UnsavedChangesModalPayload = {
  overrideTitleTextKey?: string;
  overrideContentTextKey?: string;
}

@Component({
  selector: 'app-modal-unsaved-changes',
  imports: [I18nPipe, ModalComponent, ButtonComponent, UiIconComponent],
  templateUrl: './modal-unsaved-changes.component.html'
})
export class UnsavedChangesModalComponent implements OnInit, OnDestroy {

  private readonly modalService = inject(ModalService);
  private readonly translationService = inject(TranslationService);

  private readonly currentPayload = signal<UnsavedChangesModalPayload | null>(null);
  
  readonly titleText = computed(() => this.translationService.translate(this.currentPayload()?.overrideTitleTextKey ?? 'unsavedChanges.question'));
  readonly contentText = computed(() => this.translationService.translate(this.currentPayload()?.overrideContentTextKey ?? 'unsavedChanges.consequence'));

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.unsavedChangesModalPayload$
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

  onConfirm() {
    this.modalService.onConfirm();

    setTimeout(() => this.resetModal(), 300);
  }

  private resetModal() {
    this.currentPayload.set(null);
  }

}
