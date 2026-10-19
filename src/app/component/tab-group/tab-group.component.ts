import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, contentChildren, ElementRef, input, output, viewChild } from '@angular/core';
import { TabItemComponent } from '@src/app/component/tab-item/tab-item.component';
import { TabGroupItemHeaderComponent, TabItemInfo } from "@src/app/component/tab-group-item-header/tab-group-item-header.component";

@Component({
  selector: 'app-tab-group',
  imports: [CommonModule, TabGroupItemHeaderComponent],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css'
})
export class TabGroupComponent implements AfterContentInit {

  readonly activeTab = input.required<string | null>();
  readonly horizontalScroll = input(false);
  readonly stretchWholeWidth = input(true);
  readonly onTabSelected = output<string>();

  readonly groupContainerElement = viewChild.required<ElementRef<HTMLElement>>('groupContainer');

  readonly tabs = contentChildren(TabItemComponent);

  ngAfterContentInit(): void {
    const tabsValue = this.tabs();
    const activeTabs = tabsValue.filter(tab => tab.active());
    if (activeTabs.length === 0 && tabsValue.length > 0) {
      this.selectTab(tabsValue[0].tabId(), false);
    }
  }

  onTabItemSelected(tabItem: TabItemInfo) {
    this.selectTab(tabItem.id);

    const containerWidth = this.groupContainerElement().nativeElement.getBoundingClientRect().width;

    const containerScrollLeft = this.groupContainerElement().nativeElement.scrollLeft;
    const itemLeft = tabItem.position.left;

    const effectiveLeft = containerScrollLeft + itemLeft - 24;

    const elementTooFarLeft = tabItem.position.x - 24 < 0;
    const elementTooFarRight = (tabItem.position.x + tabItem.position.width) > containerWidth;

    if (elementTooFarLeft || elementTooFarRight) {
      // scroll in a way the elemnt will be centered (or all the way to the left/right if they are at one of the ends)
      this.groupContainerElement().nativeElement.scrollTo({ left: effectiveLeft - ((containerWidth - tabItem.position.width) / 2), behavior: 'smooth' })
    }
  }

  selectTab(tabId: string, publish: boolean = true) {
    this.tabs().forEach((tab) => tab.active.set(tab.tabId() === tabId));

    if (publish === true) {
      this.onTabSelected.emit(tabId);
    }
  }

}
