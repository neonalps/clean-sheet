import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Chip, ChipComponent } from '@src/app/component/chip/chip.component';
import { assertDefined, assertUnreachable } from '@src/app/util/common';

export type ChipGroupMode = 'single';   // could also support: toggle, multi

export type ChipGroupInput = {
  chips: Chip[];
  mode: ChipGroupMode;
  dynamicClassNamesContainer?: string[];
  dynamicClassNamesChip?: string[];
  chipBoundingClassNames?: string[];
};

@Component({
  selector: 'app-chip-group',
  imports: [ChipComponent, CommonModule],
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.css'
})
export class ChipGroupComponent {

  readonly chipGroup = input.required<ChipGroupInput>();

  readonly onSelected = output<string | number | boolean>();

  onClick(chip: Chip) {
    if (chip.selected === true) {
      return;
    }

    const currentChipGroup = this.chipGroup();
    assertDefined(currentChipGroup);

    switch (currentChipGroup!.mode) {
      case 'single':
        currentChipGroup!.chips.forEach(chip => chip.selected = false);
        chip.selected = true;
        this.onSelected.emit(chip.value);
        break;
      default:
        assertUnreachable(currentChipGroup!.mode);
    }
  }

}
