import { Component, computed, input } from '@angular/core';
import { SeasonTitle } from '@src/app/model/season';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { UiIconDescriptor } from '@src/app/model/icon';
import { isDefined } from '@src/app/util/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-season-title-small',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './season-title-small.component.html'
})
export class SeasonTitleSmallComponent {

  readonly item = input.required<SeasonTitle>();
  
  readonly competitionIconDescriptor = computed<UiIconDescriptor | null>(() => {
    const competitionIcon = this.item().competition.iconSmall;
    return isDefined(competitionIcon) ? { type: 'competition', content: competitionIcon } : null;
  });

}
