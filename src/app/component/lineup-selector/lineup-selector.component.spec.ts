import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineupSelectorComponent } from './lineup-selector.component';

describe('LineupSelectorComponent', () => {
  let component: LineupSelectorComponent;
  let fixture: ComponentFixture<LineupSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineupSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineupSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
