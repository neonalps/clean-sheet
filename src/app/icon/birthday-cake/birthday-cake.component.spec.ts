import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdayCakeComponent } from './birthday-cake.component';

describe('BirthdayCakeComponent', () => {
  let component: BirthdayCakeComponent;
  let fixture: ComponentFixture<BirthdayCakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirthdayCakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdayCakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
