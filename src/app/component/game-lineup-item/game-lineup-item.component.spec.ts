import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLineupItemComponent } from './game-lineup-item.component';

describe('GameLineupItemComponent', () => {
  let component: GameLineupItemComponent;
  let fixture: ComponentFixture<GameLineupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameLineupItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLineupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
