import { Component, Input } from '@angular/core';
import { FootballComponent } from '@src/app/icon/football/football.component';
import { UiIconDescriptor } from '@src/app/model/icon';
import { BirthdayCakeComponent } from "@src/app/icon/birthday-cake/birthday-cake.component";
import { ClubIconComponent } from "@src/app/component/club-icon/club-icon.component";
import { PlayerIconComponent } from '@src/app/component/player-icon/player-icon.component';
import { PlayingFootballComponent } from "@src/app/icon/playing-football/playing-football.component";
import { FootballGoalComponent } from "@src/app/icon/football-goal/football-goal.component";
import { CompetitionTableComponent } from "@src/app/icon/competition-table/competition-table.component";
import { FootballShoeComponent } from "@src/app/icon/football-shoe/football-shoe.component";
import { FootballPitchComponent } from "@src/app/icon/football-pitch/football-pitch.component";
import { SofascoreComponent } from "@src/app/icon/sofascore/sofascore.component";
import { MenuIconComponent } from "@src/app/icon/menu/menu.component";
import { GoogleIconComponent } from '@src/app/icon/google/google.component';
import { MenuIconVerticalComponent } from "@src/app/icon/menu-vertical/menu-vertical.component";

@Component({
  selector: 'app-ui-icon',
  imports: [
    FootballComponent,
    BirthdayCakeComponent,
    ClubIconComponent,
    PlayerIconComponent,
    PlayingFootballComponent,
    FootballGoalComponent,
    CompetitionTableComponent,
    FootballShoeComponent,
    FootballPitchComponent,
    SofascoreComponent,
    MenuIconComponent,
    GoogleIconComponent,
    MenuIconVerticalComponent
],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class UiIconComponent {

  @Input() descriptor!: UiIconDescriptor;

}
