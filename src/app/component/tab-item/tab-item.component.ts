import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';

@Component({
  selector: 'app-tab-item',
  imports: [CommonModule],
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.css'
})
export class TabItemComponent {

  readonly tabId = input.required<string>();
  readonly tabTitle = input('');
  readonly tabIcon = input<UiIconDescriptor>();
  readonly tabIconClasses = input(['width-sm', 'relative', 'top-2']);

  readonly active = signal(false);

}
