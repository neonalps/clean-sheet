import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundGamesComponent } from './round-games.component';

describe('RoundGamesComponent', () => {
  let component: RoundGamesComponent;
  let fixture: ComponentFixture<RoundGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
