import { Component, inject, input, OnInit, output, signal } from '@angular/core';
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
  readonly onClick = output<Person>();

  readonly iconContainerWidth = input('width-md');
  readonly iconMargin = input('mr-2');
  readonly lastNameBold = input(true);
  readonly showNationalities = input(false);
  readonly textSize = input('text-base');
  readonly clickable = input(false);
  
  readonly countryFlags = signal<CountryFlag[]>([]);

  private readonly countryFlagService = inject(CountryFlagService);

  ngOnInit(): void {
    const nationalities = this.person().nationalities;
    if (this.showNationalities() && isDefined(nationalities)) {
      this.countryFlags.set(this.countryFlagService.resolveNationalities(nationalities));
    }
  }

  handleClick(): void {
    if (this.clickable() !== true) {
      return;
    }

    this.onClick.emit(this.person());
  }

}
