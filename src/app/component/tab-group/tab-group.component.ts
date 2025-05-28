import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';
import { TabItemComponent } from '@src/app/component/tab-item/tab-item.component';

@Component({
  selector: 'app-tab-group',
  imports: [CommonModule],
  templateUrl: './tab-group.component.html',
  styleUrl: './tab-group.component.css'
})
export class TabGroupComponent implements AfterContentInit {

  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

  ngAfterContentInit(): void {
     // Activate the first tab by default
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0 && this.tabs.first) {
      this.selectTab(0);
    }
  }

  selectTab(index: number) {
    this.tabs.forEach((tab, i) => tab.active = i === index);
  }

}
