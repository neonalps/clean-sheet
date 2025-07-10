import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface Chip {
  selected: boolean;
  value: string | number | boolean;
  displayText: string;
  displayIcon?: string;
  additionalClasses?: string[];
}

@Component({
  selector: 'app-chip',
  imports: [CommonModule],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css'
})
export class ChipComponent {

  @Input() chip!: Chip;

}
