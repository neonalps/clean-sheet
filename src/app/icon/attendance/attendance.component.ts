import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon-attendance',
  imports: [],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceIconComponent {

  @Input() color = "white";

}
