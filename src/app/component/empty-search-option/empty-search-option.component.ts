import { Component, input } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

@Component({
  selector: 'app-empty-search-option',
  imports: [UiIconComponent],
  templateUrl: './empty-search-option.component.html'
})
export class EmptySearchOptionComponent {

  readonly iconDescriptor = input.required<UiIconDescriptor>();
  readonly emptyText = input.required<string>();

}
