import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-chevron-right',
  imports: [],
  templateUrl: './chevron-right.component.html',
  styleUrl: './chevron-right.component.css'
})
export class ChevronRightComponent {

  @Input() color = COLOR_LIGHT;

}
