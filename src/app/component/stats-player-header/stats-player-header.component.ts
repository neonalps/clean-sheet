import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-stats-player-header',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './stats-player-header.component.html',
  styleUrl: './stats-player-header.component.css'
})
export class StatsPlayerHeaderComponent {

  @Input() containerClasses: string | string[] = '';
  @Input() headerText!: string;

}
