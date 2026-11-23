import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { Nullish } from '@src/app/util/types';
import { VenueId } from '@src/app/util/domain-types';
import { BasicVenue } from '@src/app/model/venue';
import { BaseVenueInformation, ModifyBaseVenueComponent } from '@src/app/component/modify-base-venue/modify-base-venue.component';
import { ensureNotNullish } from '@src/app/util/common';

export type ModifyVenuePayload = {
  venue: Nullish<BasicVenue>;
};

export type ModifyVenueConfirmPayload = {
  id: Nullish<VenueId>;
  name: string;
  shortName: string;
  city: string;
  district?: string;
  countryCode: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-modal-modify-venue',
  imports: [CommonModule, ModalComponent, I18nPipe, ButtonComponent, ModifyBaseVenueComponent],
  templateUrl: './modal-modify-venue.component.html' 
})
export class ModalModifyVenueComponent implements OnInit, OnDestroy {
  
  readonly submittablePayload = signal<BaseVenueInformation | null>(null);
  readonly isSubmittable = computed(() => this.submittablePayload() !== null);
  
  private readonly currentPayload = signal<ModifyVenuePayload | null>(null);
  private readonly venueId = signal<VenueId | null>(null);

  readonly baseVenueInformationInput = computed<Partial<BaseVenueInformation>>(() => {
    const payload = this.currentPayload();
    if (payload === null) {
      return {};
    }

    return {
      name: payload.venue?.name ?? '',
      shortName: payload.venue?.shortName ?? '',
      city: payload.venue?.city ?? '',
      district: payload.venue?.district ?? '',
      countryCode: payload.venue?.countryCode ?? '',
      capacity: payload.venue?.capacity ?? 0,
      latitude: payload.venue?.latitude ?? 0,
      longitude: payload.venue?.longitude ?? 0,
    };
  });

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.modifyVenuePayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);
        this.venueId.set(ensureNotNullish(payload.venue?.id));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCancel() {
    this.modalService.onCancel();

    setTimeout(() => this.resetModal(), 200);
  }

  onConfirm() {
    const confirmPayload = this.submittablePayload();
    if (confirmPayload === null) {
      return;
    }

    this.modalService.onConfirm({ ...confirmPayload, id: this.venueId() } satisfies ModifyVenueConfirmPayload);

    setTimeout(() => this.resetModal(), 200);
  }

  private resetModal() {
    this.currentPayload.set(null);
    this.venueId.set(null);
  }

}
