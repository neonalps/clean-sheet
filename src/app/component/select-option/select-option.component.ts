import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { OptionId, SelectOption } from '@src/app/component/select/option';

@Component({
  selector: 'app-select-option',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './select-option.component.html'
})
export class SelectOptionComponent {

  readonly option = input.required<SelectOption>();
  readonly selected = input.required<boolean>();
  readonly shouldCenterOptions = input(false);

  readonly onToggle = output<OptionId>();

  toggleOption() {
    this.onToggle.emit(this.option().id);
  }

}
