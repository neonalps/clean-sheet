import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-chevron-left',
  imports: [],
  templateUrl: './chevron-left.component.html',
  styleUrl: './chevron-left.component.css'
})
export class ChevronLeftComponent {

  @Input() color = COLOR_LIGHT;

}
