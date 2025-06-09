import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLineupComponent } from './game-lineup.component';

describe('GameLineupComponent', () => {
  let component: GameLineupComponent;
  let fixture: ComponentFixture<GameLineupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLineupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLineupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
