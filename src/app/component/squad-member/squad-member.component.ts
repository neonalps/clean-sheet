import { Component, computed, input } from '@angular/core';
import { SquadMember } from '@src/app/model/squad';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { NationalitiesComponent } from '@src/app/component/nationalities/nationalities.component';
import { Nullish } from '@src/app/util/types';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-squad-member',
  imports: [CommonModule, I18nPipe, UiIconComponent, NationalitiesComponent],
  templateUrl: './squad-member.component.html'
})
export class SquadMemberComponent {

  readonly member = input.required<SquadMember>();
  readonly containerClass = input("flex");

  readonly nationalities = computed<Nullish<string[]>>(() => this.member().player.nationalities);

}
