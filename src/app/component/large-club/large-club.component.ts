import { Component, Input } from '@angular/core';
import { ClubIconComponent } from '@src/app/component/club-icon/club-icon.component';
import { SmallClub } from '@src/app/model/club';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-large-club',
  imports: [ClubIconComponent, CommonModule],
  templateUrl: './large-club.component.html',
  styleUrl: './large-club.component.css'
})
export class LargeClubComponent {

  @Input() club!: SmallClub;

}
