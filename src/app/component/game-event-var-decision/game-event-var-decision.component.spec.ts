import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventVarDecisionComponent } from './game-event-var-decision.component';

describe('GameEventVarDecisionComponent', () => {
  let component: GameEventVarDecisionComponent;
  let fixture: ComponentFixture<GameEventVarDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventVarDecisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventVarDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
