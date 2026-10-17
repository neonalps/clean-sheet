import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { UiIconDescriptor } from '@src/app/model/icon';

export type TabItemInfo = {
  id: string;
  position: {
    x: number;
    y: number;
    left: number;
    right: number;
    top: number;
    bottom: number;
    width: number;
    height: number
  }
}

@Component({
  selector: 'app-tab-group-item-header',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './tab-group-item-header.component.html',
  styleUrl: './tab-group-item-header.component.css'
})
export class TabGroupItemHeaderComponent {

  readonly headerElement = viewChild.required<ElementRef<HTMLElement>>('header');

  readonly active = input.required<boolean>();
  readonly tabId = input.required<string>();
  readonly tabIcon = input<UiIconDescriptor>();
  readonly tabIconClasses = input<string[]> ([]);
  readonly tabTitle = input.required<string>();
  readonly wordBreak = input(true);

  readonly onTabItemSelected = output<TabItemInfo>();

  onHeaderClicked(): void {
    const elementPosition = this.headerElement().nativeElement.getBoundingClientRect();
    
    this.onTabItemSelected.emit({
      id: this.tabId(),
      position: {
        x: elementPosition.x,
        y: elementPosition.y,
        left: elementPosition.left,
        right: elementPosition.right,
        top: elementPosition.top,
        bottom: elementPosition.bottom,
        height: elementPosition.height,
        width: elementPosition.width,
      }
    });
  }

}
