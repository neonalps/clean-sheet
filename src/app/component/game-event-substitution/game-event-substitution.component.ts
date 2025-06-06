import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiPerson, UiSubstitutionGameEvent } from '@src/app/model/game';
import { GameEventComponent } from '../game-event/game-event.component';
import { isDefined } from '@src/app/util/common';
import { ArrowLeftComponent } from "../../icon/arrow-left/arrow-left.component";
import { ArrowRightComponent } from '@src/app/icon/arrow-right/arrow-right.component';

@Component({
  selector: 'app-game-event-substitution',
  imports: [CommonModule, GameEventComponent, ArrowLeftComponent, ArrowRightComponent],
  templateUrl: './game-event-substitution.component.html',
  styleUrl: './game-event-substitution.component.css'
})
export class GameEventSubstitutionComponent {

  @Input() event!: UiSubstitutionGameEvent;

  getPlayerOff(): string {
    return this.getPersonName(this.event.playerOff);
  }

  getPlayerOn(): string {
    return this.getPersonName(this.event.playerOn);
  }

  private getPersonName(person: UiPerson): string {
    return [person.firstName, person.lastName].filter(item => isDefined(item)).join(' ');
  }

}
