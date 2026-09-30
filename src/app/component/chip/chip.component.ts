import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

export interface Chip {
  selected: boolean;
  value: string | number | boolean;
  displayText?: string;
  displayIcon?: UiIconDescriptor;
  additionalClasses?: string[];
  colorMode?: ChipColorMode;
  showDisplayTextOnlyWhileSelected?: boolean;
}

export type ChipColorMode = {
  bgColorSelected: string;
  textColorSelected: string;
  bgColorHover: string;
}

@Component({
  selector: 'app-chip',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './chip.component.html',
  styleUrl: './chip.component.css'
})
export class ChipComponent {

  private static readonly DEFAULT_COLOR_MODE: ChipColorMode = {
    bgColorSelected: 'bg-color-light-grey-darker',
    textColorSelected: 'text-dark-grey',
    bgColorHover: 'hover:bg-color-dark-grey-lighter',
  }

  readonly chip = input.required<Chip>();
  readonly colorMode = input<ChipColorMode>();
  readonly dynamicClassNames = input<string | string[]>();
  readonly dynamicBoundingClassNames = input<string[]>();

  readonly effectiveDynamicClassNames = computed(() => this.dynamicClassNames() ?? 'text-xs');
  readonly effectiveColorMode = computed(() => this.colorMode() ?? ChipComponent.DEFAULT_COLOR_MODE);

  getBoundingClasses(): string[] {
    const boundingClasses: string[] = [];

    if (this.chip().selected) {
      boundingClasses.push(this.effectiveColorMode().bgColorSelected, this.effectiveColorMode().textColorSelected);
    } else {
      boundingClasses.push(this.effectiveColorMode().bgColorHover);
    }

    const dynamicBoundingClassNamesValue = this.dynamicBoundingClassNames();
    if (dynamicBoundingClassNamesValue && dynamicBoundingClassNamesValue.length > 0) {
      boundingClasses.push(...dynamicBoundingClassNamesValue);
    }

    return boundingClasses;
  }

  getDynamicClasses(): string[] {
    const dynamicClasses = [];
    if (this.chip().selected) {
      dynamicClasses.push(`bold`);
    }

    return [...this.effectiveDynamicClassNames(), ...dynamicClasses];
  }

}
