import { Component, input } from '@angular/core';
import { ClubIconComponent } from '@src/app/component/club-icon/club-icon.component';
import { SmallClub } from '@src/app/model/club';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-club',
  imports: [ClubIconComponent, CommonModule],
  templateUrl: './small-club.component.html'
})
export class SmallClubComponent {

  readonly club = input.required<SmallClub>();
  readonly iconPosition = input<'left' | 'right'>('left');

}
