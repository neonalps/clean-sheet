import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonSquadComponent } from './season-squad.component';

describe('SeasonSquadComponent', () => {
  let component: SeasonSquadComponent;
  let fixture: ComponentFixture<SeasonSquadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeasonSquadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonSquadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
