import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPlayerHeaderComponent } from './stats-player-header.component';

describe('StatsPlayerHeaderComponent', () => {
  let component: StatsPlayerHeaderComponent;
  let fixture: ComponentFixture<StatsPlayerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPlayerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsPlayerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
