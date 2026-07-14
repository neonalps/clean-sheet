import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesFavouritesComponent } from './games-favourites.component';

describe('GamesFavouritesComponent', () => {
  let component: GamesFavouritesComponent;
  let fixture: ComponentFixture<GamesFavouritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesFavouritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
