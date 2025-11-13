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
import { EditIconComponent } from "@src/app/icon/edit/edit.component";
import { DeleteIconComponent } from '@src/app/icon/delete/delete.component';
import { ImportIconComponent } from '@src/app/icon/import/import.component';
import { ProfileIconComponent } from "@src/app/icon/profile/profile.component";
import { LoadingComponent } from '@src/app/component/loading/loading.component';
import { ChevronLeftComponent } from "@src/app/icon/chevron-left/chevron-left.component";
import { SaveIconComponent } from "@src/app/icon/save/save.component";
import { FilterIconComponent } from '@src/app/icon/filter/filter.component';
import { DragHandleIconComponent } from "@src/app/icon/drag-handle/drag-handle.component";
import { ArrowLeftComponent } from "@src/app/icon/arrow-left/arrow-left.component";
import { ArrowRightComponent } from "@src/app/icon/arrow-right/arrow-right.component";
import { GoalkeeperGloveComponent } from "@src/app/icon/goalkeeper-glove/goalkeeper-glove.component";

@Component({
  selector: 'app-ui-icon',
  imports: [
    LoadingComponent,
    FootballComponent,
    BirthdayCakeComponent,
    ClubIconComponent,
    PlayerIconComponent,
    PlayingFootballComponent,
    FilterIconComponent,
    FootballGoalComponent,
    CompetitionTableComponent,
    FootballShoeComponent,
    FootballPitchComponent,
    SofascoreComponent,
    MenuIconComponent,
    GoogleIconComponent,
    MenuIconVerticalComponent,
    EditIconComponent,
    DeleteIconComponent,
    ImportIconComponent,
    ProfileIconComponent,
    ChevronLeftComponent,
    SaveIconComponent,
    DragHandleIconComponent,
    ArrowLeftComponent,
    ArrowRightComponent,
    GoalkeeperGloveComponent
],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css'
})
export class UiIconComponent {

  @Input() descriptor!: UiIconDescriptor;

}
