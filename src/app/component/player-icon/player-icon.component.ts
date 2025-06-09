import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-icon',
  imports: [CommonModule],
  templateUrl: './player-icon.component.html',
  styleUrl: './player-icon.component.css'
})
export class PlayerIconComponent {

  @Input() iconUrl?: string;
  @Input() iconBgColorClass = "bg-color-light-grey";

}
