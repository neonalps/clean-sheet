import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventCardComponent } from './game-event-card.component';

describe('GameEventCardComponent', () => {
  let component: GameEventCardComponent;
  let fixture: ComponentFixture<GameEventCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
