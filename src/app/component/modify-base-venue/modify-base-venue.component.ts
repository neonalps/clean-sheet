import { Component, computed, effect, ElementRef, input, OnInit, output, signal, viewChild } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { SelectNationalitiesComponent } from '@src/app/component/select-nationalities/select-nationalities.component';

export type BaseVenueInformation = {
  name: string;
  shortName: string;
  city: string;
  countryCode: string;
  capacity: number;
  latitude: number;
  longitude: number;
}

@Component({
  selector: 'app-modify-base-venue',
  imports: [I18nPipe, SelectNationalitiesComponent],
  templateUrl: './modify-base-venue.component.html'
})
export class ModifyBaseVenueComponent implements OnInit {

  readonly input = input.required<Partial<BaseVenueInformation>>();

  readonly onUpdate = output<BaseVenueInformation | null>();
  readonly onFormDirtyUpdate = output<boolean>();

  readonly fullNameElement = viewChild.required<ElementRef<HTMLInputElement>>('fullName');
  readonly shortNameElement = viewChild.required<ElementRef<HTMLInputElement>>('shortName');
  readonly cityElement = viewChild.required<ElementRef<HTMLInputElement>>('city');
  readonly capacityElement = viewChild.required<ElementRef<HTMLInputElement>>('capacity');
  readonly latitudeElement = viewChild.required<ElementRef<HTMLInputElement>>('latitude');
  readonly longitudeElement = viewChild.required<ElementRef<HTMLInputElement>>('longitude');

  readonly emulatedNationalitiesValue = computed<string[]>(() => {
    const countryCode = this.countryCodeValue();
    return countryCode !== '' ? [countryCode] : [];
  });

  readonly fullNameValue = signal<string>('');
  readonly shortNameValue = signal<string>('');
  readonly cityValue = signal<string>('');
  readonly countryCodeValue = signal<string>('');
  readonly capacityValue = signal<number>(0);
  readonly latitudeValue = signal<number>(0);
  readonly longitudeValue = signal<number>(0);

  private readonly submittablePayload = computed<BaseVenueInformation | null>(() => {
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

    const capacity = this.capacityValue();
    if (capacity < 0) {
      return null;
    }

    const latitude = this.latitudeValue();
    const longitude = this.longitudeValue();

    return {
      name: fullName,
      shortName,
      countryCode,
      city,
      capacity,
      latitude,
      longitude,
    };
  });

  private readonly isFormDirty = computed<boolean>(() => {
    return this.fullNameValue().trim() !== ''
      || this.shortNameValue().trim() !== ''
      || this.cityValue().trim() !== ''
      || this.capacityValue() !== 0
      || this.countryCodeValue().trim() !== ''
      || this.latitudeValue() !== 0
      || this.longitudeValue() !== 0;
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

      const currentCountryCode = currentInput.countryCode ?? '';
      this.countryCodeValue.set(currentCountryCode);

      const currentCapacity = currentInput.capacity ?? 0;
      this.capacityElement().nativeElement.value = currentCapacity.toString();
      this.capacityValue.set(currentCapacity);

      const currentLatitude = currentInput.latitude ?? 0;
      this.latitudeElement().nativeElement.value = currentLatitude.toString();
      this.latitudeValue.set(currentLatitude);

      const currentLongitude = currentInput.longitude ?? 0;
      this.longitudeElement().nativeElement.value = currentLongitude.toString();
      this.longitudeValue.set(currentLongitude);
    });

    effect(() => {
      this.onUpdate.emit(this.submittablePayload());
    });

    effect(() => {
      this.onFormDirtyUpdate.emit(this.isFormDirty());
    })
  }

  ngOnInit(): void {
    setTimeout(() => this.fullNameElement().nativeElement.focus());
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

  onCapacityChange(): void {
    this.capacityValue.set(this.capacityElement().nativeElement.valueAsNumber);
  }

  onNationalitiesChanged(newValue: string[]): void {
    this.countryCodeValue.set(newValue[0]);
  }

  onLatitudeChange(): void {
    this.latitudeValue.set(this.latitudeElement().nativeElement.valueAsNumber);
  }

  onLongitudeChange(): void {
    this.longitudeValue.set(this.longitudeElement().nativeElement.valueAsNumber);
  }

}
