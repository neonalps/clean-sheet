import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventComponent } from './game-event.component';

describe('GameEventComponent', () => {
  let component: GameEventComponent;
  let fixture: ComponentFixture<GameEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
