import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventPsoComponent } from './game-event-pso.component';

describe('GameEventPsoComponent', () => {
  let component: GameEventPsoComponent;
  let fixture: ComponentFixture<GameEventPsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventPsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventPsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
