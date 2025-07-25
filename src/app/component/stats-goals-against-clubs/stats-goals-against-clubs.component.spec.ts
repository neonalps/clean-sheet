import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGoalsAgainstClubsComponent } from './stats-goals-against-clubs.component';

describe('StatsGoalsAgainstClubsComponent', () => {
  let component: StatsGoalsAgainstClubsComponent;
  let fixture: ComponentFixture<StatsGoalsAgainstClubsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsGoalsAgainstClubsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsGoalsAgainstClubsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
