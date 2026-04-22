import { Component, inject, input, OnInit, signal } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { Person } from '@src/app/model/person';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { isDefined } from '@src/app/util/common';

@Component({
  selector: 'app-person-card',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './person-card.component.html',
})
export class PersonCardComponent implements OnInit {

  readonly person = input.required<Person>();

  readonly iconContainerWidth = input('width-md');
  readonly lastNameBold = input(true);
  readonly showNationalities = input(false);
  readonly textSize = input('text-base');
  
  readonly countryFlags = signal<CountryFlag[]>([]);

  private readonly countryFlagService = inject(CountryFlagService);

  ngOnInit(): void {
    const nationalities = this.person().nationalities;
    if (this.showNationalities() && isDefined(nationalities)) {
      this.countryFlags.set(this.countryFlagService.resolveNationalities(nationalities));
    }
  }

}
