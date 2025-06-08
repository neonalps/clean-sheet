import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-stadium',
  imports: [],
  templateUrl: './stadium.component.html',
  styleUrl: './stadium.component.css'
})
export class StadiumIconComponent {

  @Input() color = "#ffffff";

}
