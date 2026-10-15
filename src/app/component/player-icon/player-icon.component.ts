import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
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

  readonly iconUrl = input<string>();
  readonly iconBgColorClass = input("bg-color-light-grey");
  readonly containerClass = input<string>();
  readonly yellowCard = input<string>();
  readonly yellowRedCard = input<string>();
  readonly redCard = input<string>();
  readonly off = input<string>();
  readonly captain = input<boolean>();
  readonly showPlaceholder = input<boolean>();

}
