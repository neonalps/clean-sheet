import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesAttendedComponent } from './games-attended.component';

describe('GamesAttendedComponent', () => {
  let component: GamesAttendedComponent;
  let fixture: ComponentFixture<GamesAttendedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesAttendedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesAttendedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
