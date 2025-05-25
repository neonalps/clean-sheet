import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-check',
  imports: [],
  templateUrl: './check.component.html',
  styleUrl: './check.component.css'
})
export class CheckComponent {

  @Input() color: string = "white";

}
