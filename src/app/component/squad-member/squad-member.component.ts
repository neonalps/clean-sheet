import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { SquadMember } from '@src/app/model/squad';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { CountryFlagService } from '@src/app/module/country-flag/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-squad-member',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './squad-member.component.html'
})
export class SquadMemberComponent {

  private readonly countryFlagService = inject(CountryFlagService);

  readonly member = input.required<SquadMember>();
  readonly containerClass = input("flex");

  readonly nationalities = computed(() => this.countryFlagService.resolveNationalities(this.member().player.nationalities ?? []));

}
