import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { SquadMember } from '@src/app/model/squad';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { CountryFlag, CountryFlagService } from '@src/app/module/country-flag/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-squad-member',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './squad-member.component.html',
  styleUrl: './squad-member.component.css'
})
export class SquadMemberComponent {

  @Input() member!: SquadMember;
  @Input() containerClass = "flex";

  private readonly countryFlagService = inject(CountryFlagService);

  getNationalities(): CountryFlag[] {
    return this.countryFlagService.resolveNationalities(this.member.player.nationalities ?? []);
  }

}
