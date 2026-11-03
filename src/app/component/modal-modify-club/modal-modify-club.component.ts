import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { Nullish } from '@src/app/util/types';
import { SelectNationalitiesComponent } from '@src/app/component/select-nationalities/select-nationalities.component';
import { BasicClub } from '@src/app/model/club';
import { ClubId } from '@src/app/util/domain-types';

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
  // TODO add homeVenue as either ID or create payload
}

@Component({
  selector: 'app-modal-modify-club',
  imports: [CommonModule, ModalComponent, I18nPipe, ButtonComponent, SelectNationalitiesComponent],
  templateUrl: './modal-modify-club.component.html' 
})
export class ModalModifyClubComponent implements OnInit, OnDestroy {

  readonly fullNameElement = viewChild.required<ElementRef<HTMLInputElement>>('fullName');
  readonly shortNameElement = viewChild.required<ElementRef<HTMLInputElement>>('shortName');
  readonly cityElement = viewChild.required<ElementRef<HTMLInputElement>>('city');

  readonly emulatedNationalitiesValue = computed<string[]>(() => {
    const countryCode = this.countryCodeValue();
    return countryCode !== '' ? [countryCode] : [];
  });
  readonly isEditing = computed(() => this.clubId() !== null);
  readonly isSubmittable = computed(() => this.submittablePayload() !== null);

  readonly fullNameValue = signal<string>('');
  readonly shortNameValue = signal<string>('');
  readonly cityValue = signal<string>('');
  readonly countryCodeValue = signal<string>('');

  private readonly currentPayload = signal<ModifyClubPayload | null>(null);
  private readonly clubId = signal<ClubId | null>(null);

  private readonly submittablePayload = computed<ModifyClubConfirmPayload | null>(() => {
    const fullName = this.fullNameValue();
    if (fullName.trim().length === 0) {
      return null;
    }

    const shortName = this.shortNameValue();
    if (shortName.trim().length === 0) {
      return null;
    }

    const city = this.cityValue();
    if (city.trim().length === 0) {
      return null;
    }

    const countryCode = this.countryCodeValue();
    if (countryCode.trim().length === 0) {
      return null;
    }

    return {
      id: this.clubId(),
      name: fullName,
      shortName,
      countryCode,
      city,
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

        const currentFullName = payload.club?.name ?? '';
        this.fullNameValue.set(currentFullName);
        this.fullNameElement().nativeElement.value = currentFullName;

        const currentShortName = payload.club?.shortName ?? '';
        this.shortNameValue.set(currentShortName);
        this.shortNameElement().nativeElement.value = currentShortName;

        const currentCity = payload.club?.city ?? '';
        this.cityValue.set(currentCity);
        this.cityElement().nativeElement.value = currentCity;

        const currentCountryCode = payload.club?.countryCode ?? '';
        this.countryCodeValue.set(currentCountryCode);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFullNameChange(): void {
    this.fullNameValue.set(this.fullNameElement().nativeElement.value);
  }

  onShortNameChange(): void {
    this.shortNameValue.set(this.shortNameElement().nativeElement.value);
  }

  onCityChange(): void {
    this.cityValue.set(this.cityElement().nativeElement.value);
  }

  onNationalitiesChanged(newValue: string[]): void {
    this.countryCodeValue.set(newValue[0]);
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

      this.modalService.onConfirm(confirmPayload satisfies ModifyClubConfirmPayload);

      setTimeout(() => this.resetModal(), 200);
    }

  private resetModal() {
    this.currentPayload.set(null);
    this.clubId.set(null);

    this.fullNameElement().nativeElement.value = '';
    this.fullNameValue.set('');

    this.shortNameElement().nativeElement.value = '';
    this.shortNameValue.set('');

    this.cityElement().nativeElement.value = '';
    this.cityValue.set('');

    this.countryCodeValue.set('');
  }

}
