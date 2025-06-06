import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-club-icon',
  imports: [CommonModule],
  templateUrl: './club-icon.component.html',
  styleUrl: './club-icon.component.css'
})
export class ClubIconComponent {

  @Input() iconUrl!: string;
  @Input() iconClassName?: string;

}
