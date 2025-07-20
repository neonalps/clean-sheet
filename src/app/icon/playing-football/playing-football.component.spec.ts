import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayingFootballComponent } from './playing-football.component';

describe('PlayingFootballComponent', () => {
  let component: PlayingFootballComponent;
  let fixture: ComponentFixture<PlayingFootballComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayingFootballComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayingFootballComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
