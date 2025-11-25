import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxEyeComponent } from './checkbox-eye.component';

describe('CheckboxEyeComponent', () => {
  let component: CheckboxEyeComponent;
  let fixture: ComponentFixture<CheckboxEyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxEyeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
