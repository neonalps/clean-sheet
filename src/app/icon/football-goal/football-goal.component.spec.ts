import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballGoalComponent } from './football-goal.component';

describe('FootballGoalComponent', () => {
  let component: FootballGoalComponent;
  let fixture: ComponentFixture<FootballGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
