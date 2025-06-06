import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventsComponent } from './game-events.component';

describe('GameEventsComponent', () => {
  let component: GameEventsComponent;
  let fixture: ComponentFixture<GameEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
