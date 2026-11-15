import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { SelectComponent } from "@src/app/component/select/select.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { debounceTime, map, Observable, of, Subject, switchMap } from 'rxjs';
import { VenueFlavorId } from '@src/app/util/domain-types';
import { CommonModule } from '@angular/common';
import { EmptySearchOptionComponent } from "@src/app/component/empty-search-option/empty-search-option.component";
import { UiIconDescriptor } from '@src/app/model/icon';
import { SelectNationalitiesComponent } from '@src/app/component/select-nationalities/select-nationalities.component';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { SelectOption } from '@src/app/component/select/option';
import { isNotDefined, parseDisplayableColour } from '@src/app/util/common';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { ExternalSearchEntity } from '@src/app/model/external-search';

export type BaseClubInformation = {
  homeVenueFlavorId: VenueFlavorId;
  homeVenueName?: string;
  homeVenueIcon?: UiIconDescriptor;
  city: string;
  countryCode: string;
  name: string;
  shortName: string;
  district?: string;
  primaryColour: string;
  secondaryColour: string;
}

@Component({
  selector: 'app-modify-base-club',
  imports: [CommonModule, I18nPipe, SelectComponent, EmptySearchOptionComponent, SelectNationalitiesComponent],
  templateUrl: './modify-base-club.component.html'
})
export class ModifyBaseClubComponent {

  readonly input = input.required<Partial<BaseClubInformation>>();
  readonly onUpdate = output<BaseClubInformation>();

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
  readonly displayablePrimaryColour = computed(() => parseDisplayableColour(this.primaryColourValue()));
  readonly displayableSecondaryColour = computed(() => parseDisplayableColour(this.secondaryColourValue()));

  readonly fullNameValue = signal<string>('');
  readonly shortNameValue = signal<string>('');
  readonly cityValue = signal<string>('');
  readonly districtValue = signal<string>('');
  readonly countryCodeValue = signal<string>('');
  readonly primaryColourValue = signal<string>('');
  readonly secondaryColourValue = signal<string>('');
  readonly homeVenueFlavorIdValue = signal<VenueFlavorId | null>(null);
  readonly homeVenueName = signal<string>('');

  readonly isSearchingForVenue = signal(false);
  readonly pushSelectedVenueFlavor$ = new Subject<SelectOption>();

  private readonly venueSearch$ = new Subject<string>();

  private readonly submittablePayload = computed<BaseClubInformation | null>(() => {
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

    const homeVenueFlavorId = this.homeVenueFlavorIdValue();
    if (isNotDefined(homeVenueFlavorId)) {
      return null;
    }

    const primaryColour = this.primaryColourValue();
    const secondaryColour = this.secondaryColourValue();
    const district = this.districtValue();

    return {
      name: fullName,
      shortName,
      countryCode,
      city,
      district,
      primaryColour,
      secondaryColour,
      homeVenueFlavorId,
    };
  });

  constructor() {
    effect(() => {
      const currentInput = this.input();

      const currentFullName = currentInput.name ?? '';
      this.fullNameElement().nativeElement.value = currentFullName;
      this.fullNameValue.set(currentFullName);

      const currentShortName = currentInput.shortName ?? '';
      this.shortNameElement().nativeElement.value = currentShortName;
      this.shortNameValue.set(currentShortName);

      const currentCity = currentInput.city ?? '';
      this.cityElement().nativeElement.value = currentCity;
      this.cityValue.set(currentCity);

      const currentDistrict = currentInput.district ?? '';
      this.districtElement().nativeElement.value = currentDistrict;
      this.districtValue.set(currentDistrict);

      const currentCountryCode = currentInput.countryCode ?? '';
      this.countryCodeValue.set(currentCountryCode);

      const currentPrimaryColour = currentInput.primaryColour ?? '';
      this.primaryColourElement().nativeElement.value = currentPrimaryColour;
      this.primaryColourValue.set(currentPrimaryColour);

      const currentSecondaryColour = currentInput.secondaryColour ?? '';
      this.secondaryColourElement().nativeElement.value = currentSecondaryColour;
      this.secondaryColourValue.set(currentSecondaryColour);

      const currentHomeVenueFlavorId = currentInput.homeVenueFlavorId ?? null;
      const currentHomeVenueName = currentInput.homeVenueName ?? '';
      this.homeVenueFlavorIdValue.set(currentHomeVenueFlavorId);
      this.homeVenueName.set(currentHomeVenueName);

      if (currentHomeVenueFlavorId) {
        this.pushSelectedVenueFlavor$.next({
          id: currentHomeVenueFlavorId,
          name: currentHomeVenueName,
        })
      }
    });

    effect(() => {
      const payload = this.submittablePayload();
      if (payload === null) {
        return;
      }

      this.onUpdate.emit(payload);
    })
  }

  getVenueOptions(): Observable<SelectOption[]> {
    return this.venueSearch$.pipe(
      debounceTime(250),
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
    );
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

  onVenueSearchChanged(value: string) {
    this.venueSearch$.next(value);
  }

  onVenueSelected(option: SelectOption) {
    this.homeVenueFlavorIdValue.set(Number(option.id));
    this.homeVenueName.set(option.name);
  }

}
