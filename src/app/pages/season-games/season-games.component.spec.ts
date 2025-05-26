import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonGamesComponent } from './season-games.component';

describe('SeasonGamesComponent', () => {
  let component: SeasonGamesComponent;
  let fixture: ComponentFixture<SeasonGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
