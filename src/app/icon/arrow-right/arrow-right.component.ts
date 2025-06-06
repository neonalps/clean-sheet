import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-right',
  imports: [],
  templateUrl: './arrow-right.component.html',
  styleUrl: './arrow-right.component.css'
})
export class ArrowRightComponent {

  @Input() color = "white";

}
