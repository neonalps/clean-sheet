import { Component, computed, inject, input, output } from '@angular/core';
import { CountryFlagService } from '@src/app/module/country-flag/service';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { MultiSelectComponent } from '@src/app/component/select-multi/select-multi.component';

@Component({
  selector: 'app-select-nationalities',
  imports: [MultiSelectComponent],
  templateUrl: './select-nationalities.component.html'
})
export class SelectNationalitiesComponent {

  private readonly countryFlagService = inject(CountryFlagService);

  readonly selectedNationalities = input.required<string[]>();
  readonly excludedCountries = input<string[]>([]);

  readonly onValueChange = output<string[]>();

  readonly availableCountryOptions = computed<SelectOption[]>(() => this.countryFlagService.getSelectOptions(this.excludedCountries()));

  onCountrySelectChange(selected: OptionId[]) {
    this.onValueChange.emit(selected as string[]);
  }

}
