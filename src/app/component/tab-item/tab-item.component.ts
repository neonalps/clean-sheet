import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tab-item',
  imports: [CommonModule],
  templateUrl: './tab-item.component.html',
  styleUrl: './tab-item.component.css'
})
export class TabItemComponent {

  @Input() title = '';
  active = false;

}
