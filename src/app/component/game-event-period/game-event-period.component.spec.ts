import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventPeriodComponent } from './game-event-period.component';

describe('GameEventPeriodComponent', () => {
  let component: GameEventPeriodComponent;
  let fixture: ComponentFixture<GameEventPeriodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventPeriodComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
