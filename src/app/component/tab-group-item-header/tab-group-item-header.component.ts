import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
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

  @Input() active!: boolean;
  @Input() tabId!: string;
  @Input() tabIcon?: UiIconDescriptor;
  @Input() tabIconClasses: string[] = [];
  @Input() tabTitle!: string;
  @Input() wordBreak: boolean = true;

  @ViewChild('header', { static: false }) header!: ElementRef;

  @Output() onTabItemSelected = new EventEmitter<TabItemInfo>();

  onHeaderClicked(): void {
    const elementPosition = this.header.nativeElement.getBoundingClientRect();
    
    this.onTabItemSelected.next({
      id: this.tabId,
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
