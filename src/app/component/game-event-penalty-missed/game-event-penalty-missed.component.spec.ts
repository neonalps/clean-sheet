import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventPenaltyMissedComponent } from './game-event-penalty-missed.component';

describe('GameEventPenaltyMissedComponent', () => {
  let component: GameEventPenaltyMissedComponent;
  let fixture: ComponentFixture<GameEventPenaltyMissedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventPenaltyMissedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventPenaltyMissedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
