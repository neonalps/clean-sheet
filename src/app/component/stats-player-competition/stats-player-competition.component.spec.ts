import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsPlayerCompetitionComponent } from './stats-player-competition.component';

describe('StatsPlayerCompetitionComponent', () => {
  let component: StatsPlayerCompetitionComponent;
  let fixture: ComponentFixture<StatsPlayerCompetitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsPlayerCompetitionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsPlayerCompetitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
