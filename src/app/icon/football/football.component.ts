import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-football',
  imports: [],
  templateUrl: './football.component.html',
  styleUrl: './football.component.css'
})
export class FootballComponent {

  @Input() color = COLOR_LIGHT;

}
