import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-field-with-ball',
  imports: [],
  templateUrl: './field-with-ball.component.html',
  styleUrl: './field-with-ball.component.css'
})
export class FieldWithBallComponent {

  @Input() color: string = COLOR_LIGHT;

}
