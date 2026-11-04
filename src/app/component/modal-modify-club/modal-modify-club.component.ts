import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { Nullish } from '@src/app/util/types';
import { SelectNationalitiesComponent } from '@src/app/component/select-nationalities/select-nationalities.component';
import { BasicClub } from '@src/app/model/club';
import { ClubId, VenueId } from '@src/app/util/domain-types';
import { MultiSelectComponent } from '@src/app/component/select-multi/select-multi.component';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { requireSingleArrayElement } from '@src/app/util/array';

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
  imports: [CommonModule, ModalComponent, I18nPipe, ButtonComponent, SelectNationalitiesComponent, MultiSelectComponent],
  templateUrl: './modal-modify-club.component.html' 
})
export class ModalModifyClubComponent implements OnInit, OnDestroy {

  private readonly externalSearchService = inject(ExternalSearchService);

  readonly fullNameElement = viewChild.required<ElementRef<HTMLInputElement>>('fullName');
  readonly shortNameElement = viewChild.required<ElementRef<HTMLInputElement>>('shortName');
  readonly cityElement = viewChild.required<ElementRef<HTMLInputElement>>('city');
  readonly districtElement = viewChild.required<ElementRef<HTMLInputElement>>('district');
  readonly primaryColourElement = viewChild.required<ElementRef<HTMLInputElement>>('primaryColour');
  readonly secondaryColourElement = viewChild.required<ElementRef<HTMLInputElement>>('secondaryColour');

  readonly emulatedNationalitiesValue = computed<string[]>(() => {
    const countryCode = this.countryCodeValue();
    return countryCode !== '' ? [countryCode] : [];
  });
  readonly isEditing = computed(() => this.clubId() !== null);
  readonly isSubmittable = computed(() => this.submittablePayload() !== null);
  readonly displayablePrimaryColour = computed(() => {
    const primaryColour = this.primaryColourValue();
    if (!primaryColour.startsWith('#') || primaryColour.length !== 7) {
      return null;
    }

    return primaryColour;
  });

  readonly displayableSecondaryColour = computed(() => {
    const secondaryColour = this.secondaryColourValue();
    if (!secondaryColour.startsWith('#') || secondaryColour.length !== 7) {
      return null;
    }

    return secondaryColour;
  });

  readonly fullNameValue = signal<string>('');
  readonly shortNameValue = signal<string>('');
  readonly cityValue = signal<string>('');
  readonly districtValue = signal<string>('');
  readonly countryCodeValue = signal<string>('');
  readonly primaryColourValue = signal<string>('');
  readonly secondaryColourValue = signal<string>('');
  readonly homeVenueIdValue = signal<VenueId | null>(null);

  readonly venueOptions = signal<SelectOption[]>([]);
  readonly venueSearch$ = new Subject<string>();
  readonly isSearchingForVenue = signal(false);
  readonly selectedVenue = signal<OptionId[]>([]);

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

    const primaryColour = this.primaryColourValue();
    const secondaryColour = this.secondaryColourValue();
    const district = this.districtValue();

    return {
      id: this.clubId(),
      name: fullName,
      shortName,
      countryCode,
      city,
      district,
      primaryColour,
      secondaryColour,
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

        const currentDistrict = payload.club?.district ?? '';
        this.districtValue.set(currentDistrict);
        this.districtElement().nativeElement.value = currentDistrict;

        const currentCountryCode = payload.club?.countryCode ?? '';
        this.countryCodeValue.set(currentCountryCode);

        const currentPrimaryColour = payload.club?.primaryColour ?? '';
        this.primaryColourValue.set(currentPrimaryColour);
        this.primaryColourElement().nativeElement.value = currentPrimaryColour;

        const currentSecondaryColour = payload.club?.secondaryColour ?? '';
        this.secondaryColourValue.set(currentSecondaryColour);
        this.secondaryColourElement().nativeElement.value = currentSecondaryColour;
      });

    this.venueSearch$.pipe(
      switchMap(value => {
        if (value.trim().length === 0) {
          return of([]);
        }

        this.isSearchingForVenue.set(true);
        return this.externalSearchService.search(value, [ExternalSearchEntity.Venue]);
      }),
      map(response => {
        this.isSearchingForVenue.set(false);
        if ('items' in response) {
          return response.items.map(item => convertExternalSearchItemToSelectOption(item));
        }

        return response;
      }),
      takeUntil(this.destroy$),
    ).subscribe({
      next: searchResponse => this.venueOptions.set(searchResponse),
      error: err => {
        this.venueOptions.set([]);
        console.error(err);
      },
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

  onDistrictChange(): void {
    this.districtValue.set(this.districtElement().nativeElement.value);
  }

  onNationalitiesChanged(newValue: string[]): void {
    this.countryCodeValue.set(newValue[0]);
  }

  onPrimaryColourChange(): void {
    this.primaryColourValue.set(this.primaryColourElement().nativeElement.value);
  }

  onSecondaryColourChange(): void {
    this.secondaryColourValue.set(this.secondaryColourElement().nativeElement.value);
  }

  onHomeVenueChange(selected: OptionId[]) {
    this.selectedVenue.set(selected);
    this.homeVenueIdValue.set(requireSingleArrayElement(selected) as VenueId);
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

    this.districtElement().nativeElement.value = '';
    this.districtValue.set('');

    this.primaryColourElement().nativeElement.value = '';
    this.primaryColourValue.set('');

    this.secondaryColourElement().nativeElement.value = '';
    this.secondaryColourValue.set('');

    this.countryCodeValue.set('');
  }

}
