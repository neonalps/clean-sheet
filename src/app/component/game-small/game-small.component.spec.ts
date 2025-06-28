import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSmallComponent } from './game-small.component';

describe('GameSmallComponent', () => {
  let component: GameSmallComponent;
  let fixture: ComponentFixture<GameSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSmallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
