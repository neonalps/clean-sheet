import { Component, Input } from '@angular/core';
import { Chip, ChipComponent } from '@src/app/component/chip/chip.component';
import { assertUnreachable } from '@src/app/util/common';

export type ChipGroupMode = 'single';   // could also support: toggle, multi

@Component({
  selector: 'app-chip-group',
  imports: [ChipComponent],
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.css'
})
export class ChipGroupComponent {

  @Input() chips: Chip[] = [];
  @Input() mode: ChipGroupMode = 'single';

  onClick(chip: Chip) {
    switch (this.mode) {
      case 'single':
        this.chips.forEach(chip => chip.selected = false);
        chip.selected = true;
        break;
      default:
        assertUnreachable(this.mode);
    }
  }

}
