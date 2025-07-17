import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Chip, ChipComponent } from '@src/app/component/chip/chip.component';
import { assertUnreachable } from '@src/app/util/common';

export type ChipGroupMode = 'single';   // could also support: toggle, multi

@Component({
  selector: 'app-chip-group',
  imports: [ChipComponent, CommonModule],
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.css'
})
export class ChipGroupComponent {

  @Input() chips: Chip[] = [];
  @Input() mode: ChipGroupMode = 'single';
  @Input() dynamicClassNamesContainer?: string[];
  @Input() dynamicClassNamesChip?: string[];

  @Output() onSelected = new EventEmitter<string | number | boolean>();

  onClick(chip: Chip) {
    if (chip.selected === true) {
      return;
    }

    switch (this.mode) {
      case 'single':
        this.chips.forEach(chip => chip.selected = false);
        chip.selected = true;
        this.onSelected.next(chip.value);
        break;
      default:
        assertUnreachable(this.mode);
    }
  }

}
