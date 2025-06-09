import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePersonItemComponent } from './game-person-item.component';

describe('GameSubstituteItemComponent', () => {
  let component: GamePersonItemComponent;
  let fixture: ComponentFixture<GamePersonItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePersonItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePersonItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
