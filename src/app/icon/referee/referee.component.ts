import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-referee',
  imports: [],
  templateUrl: './referee.component.html',
  styleUrl: './referee.component.css'
})
export class RefereeIconComponent {

  @Input() color = "white";

}
