import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { BasicVenue } from '@src/app/model/venue';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { FormatNumberPipe } from '@src/app/pipe/format-number.pipe';
import { isDefined, isNotDefined } from '@src/app/util/common';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { SmallClubComponent } from "@src/app/component/small-club/small-club.component";
import { BasicClub } from '@src/app/model/club';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';

@Component({
  selector: 'app-venue-details',
  imports: [CommonModule, I18nPipe, FormatNumberPipe, ButtonComponent, SmallClubComponent],
  templateUrl: './venue-details.component.html',
})
export class VenueDetailsComponent implements OnInit {

  readonly venue = input.required<BasicVenue>();
  readonly canInteractWithHomeVenueClubs = input(true);
  readonly hideNameSection = input(false);
  readonly showCityCountryFlag = input(false);

  readonly onClubClick = output<BasicClub>();

  readonly countryFlags = signal<CountryFlag[]>([]);

  private readonly countryFlagService = inject(CountryFlagService);

  ngOnInit(): void {
    if (this.showCityCountryFlag()) {
      this.countryFlags.set(this.countryFlagService.resolveNationalities([this.venue().countryCode]));
    }
  }

  readonly locationAvailable = computed(() => {
    const venueValue = this.venue();
    return isDefined(venueValue.latitude) && isDefined(venueValue.longitude);
  });

  readonly openStreetMapLink = computed<string | null>(() => {
    const venueValue = this.venue();
    if (isNotDefined(venueValue.latitude) || isNotDefined(venueValue.longitude)) {
      return null;
    }

    return `https://www.openstreetmap.org/?mlat=${venueValue.latitude}&mlon=${venueValue.longitude}&zoom=18#map=17/${venueValue.latitude}/${venueValue.longitude}`;
  });

  readonly flavorsToDisplay = computed(() => {
    const venueValue = this.venue();
    if (venueValue.flavors.length < 2) {
      return [];
    }

    return venueValue.flavors.filter(item => item.name !== venueValue.name);
  });

  showOnMap() {
    const link = this.openStreetMapLink();

    if (isDefined(link)) {
      window.open(link, '_blank');
    }
  }

}
