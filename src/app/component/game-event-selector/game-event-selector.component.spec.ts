import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventSelectorComponent } from './game-event-selector.component';

describe('GameEventSelectorComponent', () => {
  let component: GameEventSelectorComponent;
  let fixture: ComponentFixture<GameEventSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
