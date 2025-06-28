import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, OnDestroy, Output, QueryList } from '@angular/core';
import { TabItemComponent } from '@src/app/component/tab-item/tab-item.component';
import { isDefined } from '@src/app/util/common';
import { filter, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-group',
  imports: [CommonModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css'
})
export class TabGroupComponent implements AfterContentInit, OnDestroy {

  @Input() activeTab!: Observable<string | null>;
  @Output() onTabSelected = new EventEmitter<string>();  

  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  ngAfterContentInit(): void {
    this.subscriptions.push(this.activeTab.subscribe(value => {
      if (value !== null) {
        this.selectTab(value, false);
      }
    }));

    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0 && this.tabs.first) {
      this.selectTab(this.tabs.first.tabId, false);
    }
  }

  selectTab(tabId: string, publish: boolean = true) {
    this.tabs.forEach((tab) => tab.active = tab.tabId === tabId);

    if (publish === true) {
      this.onTabSelected.next(tabId);
    }
  }

}
