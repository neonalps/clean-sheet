import { Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-icon-graph',
  imports: [],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphIconComponent {

  @Input() color = "red";

}
