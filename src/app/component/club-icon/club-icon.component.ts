import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-club-icon',
  imports: [CommonModule],
  templateUrl: './club-icon.component.html',
  styleUrl: './club-icon.component.css'
})
export class ClubIconComponent {

  iconUrl = input.required<string>();
  iconClassName = input<string>();

}
