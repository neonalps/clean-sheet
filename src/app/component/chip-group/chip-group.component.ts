import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { Chip, ChipComponent } from '@src/app/component/chip/chip.component';
import { assertDefined, assertUnreachable } from '@src/app/util/common';
import { Observable, Subject, takeUntil } from 'rxjs';

export type ChipGroupMode = 'single';   // could also support: toggle, multi

export type ChipGroupInput = {
  chips: Chip[];
  mode: ChipGroupMode;
  dynamicClassNamesContainer?: string[];
  dynamicClassNamesChip?: string[];
};

@Component({
  selector: 'app-chip-group',
  imports: [ChipComponent, CommonModule],
  templateUrl: './chip-group.component.html',
  styleUrl: './chip-group.component.css'
})
export class ChipGroupComponent {

  @Input() chipGroup$!: Observable<ChipGroupInput>;
  @Output() onSelected = new EventEmitter<string | number | boolean>();

  readonly chipGroup = signal<ChipGroupInput | null>(null);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.chipGroup$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.chipGroup.set(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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
        this.onSelected.next(chip.value);
        break;
      default:
        assertUnreachable(currentChipGroup!.mode);
    }
  }

}
