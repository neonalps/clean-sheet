import { Component, computed, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { isDefined } from '@src/app/util/common';
import { Nullish } from '@src/app/util/types';

@Component({
  selector: 'app-nationalities',
  imports: [CommonModule],
  templateUrl: './nationalities.component.html',
})
export class NationalitiesComponent {

  private readonly countryFlagService = inject(CountryFlagService);

  readonly nationalities = input.required<Nullish<string[]>>();

  readonly countryFlags = computed<CountryFlag[]>(() => {
    const nationalities = this.nationalities();
    return isDefined(nationalities) ? this.countryFlagService.resolveNationalities(nationalities) : [];
  });

}
