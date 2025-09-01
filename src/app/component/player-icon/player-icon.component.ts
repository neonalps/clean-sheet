import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ArrowLeftComponent } from '@src/app/icon/arrow-left/arrow-left.component';
import { PlaceholderPersonComponent } from '@src/app/icon/placeholder-person/placeholder-person.component';
import { FormatGameMinutePipe } from '@src/app/pipe/format-minute.pipe';

@Component({
  selector: 'app-player-icon',
  imports: [CommonModule, FormatGameMinutePipe, ArrowLeftComponent, PlaceholderPersonComponent],
  templateUrl: './player-icon.component.html',
  styleUrl: './player-icon.component.css'
})
export class PlayerIconComponent {

  @Input() iconUrl?: string;
  @Input() iconBgColorClass = "bg-color-light-grey";
  @Input() containerClass?: string;
  @Input() yellowCard?: string;
  @Input() yellowRedCard?: string;
  @Input() redCard?: string;
  @Input() off?: string;
  @Input() captain: boolean = false;
  @Input() showPlaceholder = false;

}
