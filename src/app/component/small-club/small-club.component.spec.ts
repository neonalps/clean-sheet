import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallClubComponent } from './small-club.component';

describe('SmallClubComponent', () => {
  let component: SmallClubComponent;
  let fixture: ComponentFixture<SmallClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmallClubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
