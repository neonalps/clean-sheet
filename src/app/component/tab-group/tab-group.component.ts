import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild } from '@angular/core';
import { TabItemComponent } from '@src/app/component/tab-item/tab-item.component';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TabGroupItemHeaderComponent, TabItemInfo } from "../tab-group-item-header/tab-group-item-header.component";

@Component({
  selector: 'app-tab-group',
  imports: [CommonModule, TabGroupItemHeaderComponent],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css'
})
export class TabGroupComponent implements AfterContentInit, OnDestroy {

  @Input() activeTab!: Observable<string | null>;
  @Input() horizontalScroll = false;
  @Input() stretchWholeWidth = true;
  @Output() onTabSelected = new EventEmitter<string>();  

  @ViewChild('groupContainer', { static: false }) groupContainer!: ElementRef;
  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentInit(): void {
    this.activeTab.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value !== null) {
        this.selectTab(value, false);
      }
    });

    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0 && this.tabs.first) {
      this.selectTab(this.tabs.first.tabId, false);
    }
  }

  onTabItemSelected(tabItem: TabItemInfo) {
    this.selectTab(tabItem.id);

    const containerWidth = this.groupContainer.nativeElement.getBoundingClientRect().width;

    const containerScrollLeft = this.groupContainer.nativeElement.scrollLeft;
    const itemLeft = tabItem.position.left;

    const effectiveLeft = containerScrollLeft + itemLeft - 24;

    const elementTooFarLeft = tabItem.position.x - 24 < 0;
    const elementTooFarRight = (tabItem.position.x + tabItem.position.width) > containerWidth;

    if (elementTooFarLeft || elementTooFarRight) {
      // scroll in a way the elemnt will be centered (or all the way to the left/right if they are at one of the ends)
      this.groupContainer.nativeElement.scrollTo({ left: effectiveLeft - ((containerWidth - tabItem.position.width) / 2), behavior: 'smooth' })
    }
  }

  selectTab(tabId: string, publish: boolean = true) {
    this.tabs.forEach((tab) => tab.active = tab.tabId === tabId);

    if (publish === true) {
      this.onTabSelected.next(tabId);
    }
  }

}
