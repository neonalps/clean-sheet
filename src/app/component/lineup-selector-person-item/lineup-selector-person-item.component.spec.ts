import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupSelectorPersonItemComponent } from './lineup-selector-person-item.component';

describe('LineupSelectorPersonItemComponent', () => {
  let component: LineupSelectorPersonItemComponent;
  let fixture: ComponentFixture<LineupSelectorPersonItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineupSelectorPersonItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineupSelectorPersonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
