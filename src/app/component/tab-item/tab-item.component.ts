import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UiIconDescriptor } from '@src/app/model/icon';

@Component({
  selector: 'app-tab-item',
  imports: [CommonModule],
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.css'
})
export class TabItemComponent {

  @Input() tabId!: string;
  @Input() tabTitle = '';
  @Input() tabIcon?: UiIconDescriptor;

  active = false;

}
