import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chevron-down',
  imports: [],
  templateUrl: './chevron-down.component.html',
  styleUrl: './chevron-down.component.css'
})
export class ChevronDownComponent {

  @Input() color: string = "white";

}
