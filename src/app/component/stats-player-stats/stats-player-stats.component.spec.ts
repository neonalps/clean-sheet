import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPlayerStatsComponent } from './stats-player-stats.component';

describe('StatsPlayerStatsComponent', () => {
  let component: StatsPlayerStatsComponent;
  let fixture: ComponentFixture<StatsPlayerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPlayerStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsPlayerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
