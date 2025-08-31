import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSeasonStatsComponent } from './player-season-stats.component';

describe('PlayerSeasonStatsComponent', () => {
  let component: PlayerSeasonStatsComponent;
  let fixture: ComponentFixture<PlayerSeasonStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerSeasonStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerSeasonStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
