import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventSubstitutionComponent } from './game-event-substitution.component';

describe('GameEventSubstitutionComponent', () => {
  let component: GameEventSubstitutionComponent;
  let fixture: ComponentFixture<GameEventSubstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventSubstitutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventSubstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
