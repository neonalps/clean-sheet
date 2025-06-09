import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-placeholder-person',
  imports: [],
  templateUrl: './placeholder-person.component.html',
  styleUrl: './placeholder-person.component.css'
})
export class PlaceholderPersonComponent {

  @Input() color = COLOR_LIGHT;

}
