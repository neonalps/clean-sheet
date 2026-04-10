import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

export type CheckboxChipInput = {
  id: string;
  checked: boolean;
  displayText: string;
  icon?: UiIconDescriptor;
}

export type CheckboxChipValueChanged = {
  id: string;
  checked: boolean;
}

@Component({
  selector: 'app-checkbox-chip',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './checkbox-chip.component.html',
  styleUrl: './checkbox-chip.component.css'
})
export class CheckboxChipComponent {

  readonly chip = input.required<CheckboxChipInput>();
  readonly checkedValueChanged = output<CheckboxChipValueChanged>();

  onChipClick() {
    const currentChipValue = this.chip();
    this.checkedValueChanged.emit({ id: currentChipValue.id, checked: !currentChipValue.checked });
  }

}
