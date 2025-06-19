import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-birthday-cake',
  imports: [],
  templateUrl: './birthday-cake.component.html',
  styleUrl: './birthday-cake.component.css'
})
export class BirthdayCakeComponent {

  @Input() color = COLOR_LIGHT;

}
