import { Component, Input } from '@angular/core';
import { ClubIconComponent } from '@src/app/component/club-icon/club-icon.component';
import { SmallClub } from '@src/app/model/club';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-small-club',
  imports: [ClubIconComponent, CommonModule],
  templateUrl: './small-club.component.html',
  styleUrl: './small-club.component.css'
})
export class SmallClubComponent {

  @Input() club!: SmallClub;
  @Input() iconPosition: 'left' | 'right' = 'left';

}
