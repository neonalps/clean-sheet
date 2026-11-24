import { Component, computed, inject, OnDestroy, signal } from "@angular/core";
import { I18nPipe } from "@src/app/module/i18n/i18n.pipe";
import { filter, Subject, takeUntil } from "rxjs";
import { BaseVenueInformation, ModifyBaseVenueComponent } from "@src/app/component/modify-base-venue/modify-base-venue.component";
import { ModalService } from "@src/app/module/modal/service";
import { Router } from "@angular/router";
import { ToastService } from "@src/app/module/toast/service";
import { TranslationService } from "@src/app/module/i18n/translation.service";
import { VenueService } from "@src/app/module/venue/service";
import { ensureNotNullish } from "@src/app/util/common";
import { navigateToVenue } from "@src/app/util/router";
import { ButtonComponent } from "@src/app/component/button/button.component";

@Component({
  selector: 'app-venue-create',
  imports: [I18nPipe, ModifyBaseVenueComponent, ButtonComponent],
  templateUrl: './venue-create.component.html'
})
export class VenueCreateComponent implements OnDestroy {

  private readonly modalService = inject(ModalService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly venueService = inject(VenueService);

  readonly isFormDirty = signal(false);

  private readonly currentBaseVenueInformation = signal<BaseVenueInformation | null>(null);
  private readonly isSubmitting = signal(false);

  readonly canBeSaved = computed<boolean>(() => !this.isSubmitting() && this.currentBaseVenueInformation() !== null);

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  onBaseVenueUpdate(baseVenueUpdate: BaseVenueInformation | null): void {
    this.currentBaseVenueInformation.set(baseVenueUpdate);
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
    
    const venue = ensureNotNullish(this.currentBaseVenueInformation());
    this.venueService.create({
      name: venue.name,
      shortName: venue.shortName,
      city: venue.city,
      district: venue.district,
      countryCode: venue.countryCode,
      capacity: venue.capacity,
      latitude: venue.latitude,
      longitude: venue.longitude,
    }).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: createdVenue => {
        this.toastService.addToast({ type: 'success', text: this.translationService.translate('venueCreate.success') });
        navigateToVenue(this.router, createdVenue.id, createdVenue.name);
      },
      error: err => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate('venueCreate.failure') });
        this.isSubmitting.set(false);
      }
    })
  }

  private performCancel(): void {
    window.history.back();
  }

}