import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

export interface Chip {
  selected: boolean;
  value: string | number | boolean;
  displayText?: string;
  displayIcon?: UiIconDescriptor;
  additionalClasses?: string[];
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

  @Input() chip!: Chip;
  @Input() colorMode = ChipComponent.DEFAULT_COLOR_MODE;
  @Input() dynamicClassNames?: string[];
  @Input() dynamicBoundingClassNames?: string[];

  getBoundingClasses(): string[] {
    const boundingClasses: string[] = [];

    if (this.chip.selected) {
      boundingClasses.push(this.colorMode.bgColorSelected, this.colorMode.textColorSelected);
    } else {
      boundingClasses.push(this.colorMode.bgColorHover);
    }

    if (this.dynamicBoundingClassNames && this.dynamicBoundingClassNames.length > 0) {
      boundingClasses.push(...this.dynamicBoundingClassNames);
    }

    return boundingClasses;
  }

  getDynamicClasses(): string[] {
    const dynamicClasses = [];
    if (this.chip.selected) {
      dynamicClasses.push(`bold`);
    }

    return [...(this.dynamicClassNames || ['text-xs']), ...dynamicClasses];
  }

}
