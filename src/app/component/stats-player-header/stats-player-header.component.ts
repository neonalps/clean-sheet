import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-stats-player-header',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './stats-player-header.component.html'
})
export class StatsPlayerHeaderComponent {

  readonly containerClasses = input<string | string[]>('');
  readonly headerText = input.required<string>();

}
