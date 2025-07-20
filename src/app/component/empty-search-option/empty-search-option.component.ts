import { Component, Input } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';

@Component({
  selector: 'app-empty-search-option',
  imports: [UiIconComponent],
  templateUrl: './empty-search-option.component.html',
  styleUrl: './empty-search-option.component.css'
})
export class EmptySearchOptionComponent {

  @Input() iconDescriptor!: UiIconDescriptor;
  @Input() emptyText!: string;

}
