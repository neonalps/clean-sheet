import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGroupItemHeaderComponent } from './tab-group-item-header.component';

describe('TabGroupItemHeaderComponent', () => {
  let component: TabGroupItemHeaderComponent;
  let fixture: ComponentFixture<TabGroupItemHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabGroupItemHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabGroupItemHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
