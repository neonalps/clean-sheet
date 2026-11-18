import { Component, computed, inject, OnDestroy, signal } from "@angular/core";
import { filter, Subject, takeUntil } from "rxjs";
import { BaseClubInformation, ModifyBaseClubComponent } from "@src/app/component/modify-base-club/modify-base-club.component";
import { I18nPipe } from "@src/app/module/i18n/i18n.pipe";
import { ClubService } from "@src/app/module/club/service";
import { ButtonComponent } from "@src/app/component/button/button.component";
import { ensureNotNullish } from "@src/app/util/common";
import { ToastService } from "@src/app/module/toast/service";
import { TranslationService } from "@src/app/module/i18n/translation.service";
import { navigateToClub } from "@src/app/util/router";
import { Router } from "@angular/router";
import { ModalService } from "@src/app/module/modal/service";

@Component({
  selector: 'app-club-create',
  imports: [I18nPipe, ModifyBaseClubComponent, ButtonComponent],
  templateUrl: './club-create.component.html'
})
export class ClubCreateComponent implements OnDestroy {

  private readonly clubService = inject(ClubService);
  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  readonly isFormDirty = signal(false);

  private readonly currentBaseClubInformation = signal<BaseClubInformation | null>(null);
  private readonly isSubmitting = signal(false);

  readonly canBeSaved = computed<boolean>(() => !this.isSubmitting() && this.currentBaseClubInformation() !== null);

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  onBaseClubUpdate(baseClubUpdate: BaseClubInformation): void {
    this.currentBaseClubInformation.set(baseClubUpdate);
  }

  onCancel(): void {
    if (this.isFormDirty()) {
      this.modalService.showUnsavedChangesModal({}).pipe(
        filter(event => event.type === 'confirm'),
        takeUntil(this.destroy$),
      ).subscribe({
        next: () => this.performCancel(),
      });
    } else {
      this.performCancel();
    }
  }

  onConfirm(): void {
    if (this.isSubmitting()) {
      throw new Error(`Cannot submit again`);
    }

    this.isSubmitting.set(true);
    
    const club = ensureNotNullish(this.currentBaseClubInformation());
    this.clubService.create({
      name: club.name,
      shortName: club.shortName,
      city: club.city,
      district: club.district,
      countryCode: club.countryCode,
      primaryColour: club.primaryColour,
      secondaryColour: club.secondaryColour,
      homeVenueFlavorId: club.homeVenueFlavorId,
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: createdClub => {
        this.toastService.addToast({ type: 'success', text: this.translationService.translate('clubCreate.success') });
        navigateToClub(this.router, createdClub);
      },
      error: err => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate('clubCreate.failure') });
      }
    })
  }

  private performCancel(): void {
    window.history.back();
  }

}