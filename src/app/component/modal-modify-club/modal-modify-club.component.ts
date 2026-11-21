import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { Nullish } from '@src/app/util/types';
import { BasicClub } from '@src/app/model/club';
import { ClubId, VenueFlavorId } from '@src/app/util/domain-types';
import { BaseClubInformation, ModifyBaseClubComponent } from '@src/app/component/modify-base-club/modify-base-club.component';

export type ModifyClubPayload = {
  club: Nullish<BasicClub>;
};

export type ModifyClubConfirmPayload = {
  id: Nullish<ClubId>;
  name: string;
  shortName: string;
  primaryColour?: string;
  secondaryColour?: string;
  city: string;
  district?: string;
  countryCode: string;
  homeVenueFlavorId: VenueFlavorId;
}

@Component({
  selector: 'app-modal-modify-club',
  imports: [CommonModule, ModalComponent, I18nPipe, ButtonComponent, ModifyBaseClubComponent],
  templateUrl: './modal-modify-club.component.html' 
})
export class ModalModifyClubComponent implements OnInit, OnDestroy {
  
  readonly submittablePayload = signal<BaseClubInformation | null>(null);
  readonly isSubmittable = computed(() => this.submittablePayload() !== null);
  
  private readonly currentPayload = signal<ModifyClubPayload | null>(null);
  private readonly clubId = signal<ClubId | null>(null);

  readonly baseClubInformationInput = computed<Partial<BaseClubInformation>>(() => {
    const payload = this.currentPayload();
    if (payload === null) {
      return {};
    }

    const currentHomeVenue = payload.club?.homeVenue;
    const firstFlavor = currentHomeVenue?.flavors[0];

    return {
      name: payload.club?.name ?? '',
      shortName: payload.club?.shortName ?? '',
      city: payload.club?.city ?? '',
      district: payload.club?.district ?? '',
      countryCode: payload.club?.countryCode ?? '',
      primaryColour: payload.club?.primaryColour ?? '',
      secondaryColour: payload.club?.secondaryColour ?? '',
      homeVenueFlavorId: firstFlavor?.id,
      homeVenueName: firstFlavor?.name,
    };
  });

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.modifyClubPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);
        this.clubId.set(payload.club?.id ?? null);
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

    this.modalService.onConfirm({ ...confirmPayload, id: this.clubId() } satisfies ModifyClubConfirmPayload);

    setTimeout(() => this.resetModal(), 200);
  }

  private resetModal() {
    this.currentPayload.set(null);
    this.clubId.set(null);
  }

}
