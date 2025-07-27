import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundInformationComponent } from './round-information.component';

describe('RoundInformationComponent', () => {
  let component: RoundInformationComponent;
  let fixture: ComponentFixture<RoundInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
