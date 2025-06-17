import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalWithBallComponent } from './goal-with-ball.component';

describe('GoalWithBallComponent', () => {
  let component: GoalWithBallComponent;
  let fixture: ComponentFixture<GoalWithBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalWithBallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalWithBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
