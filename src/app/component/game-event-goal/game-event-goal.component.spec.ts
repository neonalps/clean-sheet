import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventGoalComponent } from './game-event-goal.component';

describe('GameEventGoalComponent', () => {
  let component: GameEventGoalComponent;
  let fixture: ComponentFixture<GameEventGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
