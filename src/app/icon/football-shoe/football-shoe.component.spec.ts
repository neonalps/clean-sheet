import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootballShoeComponent } from './football-shoe.component';

describe('FootballShoeComponent', () => {
  let component: FootballShoeComponent;
  let fixture: ComponentFixture<FootballShoeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootballShoeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootballShoeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
