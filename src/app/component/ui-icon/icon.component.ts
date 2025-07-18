import { Component, Input } from '@angular/core';
import { FootballComponent } from '@src/app/icon/football/football.component';
import { UiIconDescriptor } from '@src/app/model/icon';
import { BirthdayCakeComponent } from "@src/app/icon/birthday-cake/birthday-cake.component";
import { ClubIconComponent } from "@src/app/component/club-icon/club-icon.component";
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';

@Component({
  selector: 'app-ui-icon',
  imports: [FootballComponent, BirthdayCakeComponent, ClubIconComponent, PlayerIconComponent],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class UiIconComponent {

  @Input() descriptor!: UiIconDescriptor;

}
