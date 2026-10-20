import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-club-icon',
  imports: [CommonModule],
  templateUrl: './club-icon.component.html'
})
export class ClubIconComponent {

  readonly iconUrl = input.required<string>();
  readonly iconClassName = input<string>();

}
