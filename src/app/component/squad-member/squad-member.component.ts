import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
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
export class SquadMemberComponent implements OnInit {

  @Input() member!: SquadMember;
  @Input() containerClass = "flex";

  readonly nationalities = signal<CountryFlag[]>([]);

  private readonly countryFlagService = inject(CountryFlagService);

  ngOnInit(): void {
    this.nationalities.set(this.countryFlagService.resolveNationalities(this.member.player.nationalities ?? []));
  }

}
