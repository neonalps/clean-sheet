import { Component, input } from '@angular/core';
import { ClubIconComponent } from '@src/app/component/club-icon/club-icon.component';
import { SmallClub } from '@src/app/model/club';

@Component({
  selector: 'app-large-club',
  imports: [ClubIconComponent],
  templateUrl: './large-club.component.html'
})
export class LargeClubComponent {

  readonly club = input.required<SmallClub>();

}
