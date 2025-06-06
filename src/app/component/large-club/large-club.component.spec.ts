import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeClubComponent } from './large-club.component';

describe('LargeClubComponent', () => {
  let component: LargeClubComponent;
  let fixture: ComponentFixture<LargeClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeClubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
