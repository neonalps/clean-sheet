import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-icon-trophy',
  imports: [],
  templateUrl: './trophy.component.html',
  styleUrl: './trophy.component.css'
})
export class TrophyIconComponent {

  @Input() color = COLOR_LIGHT;

}
