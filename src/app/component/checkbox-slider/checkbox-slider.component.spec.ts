import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxSliderComponent } from './checkbox-slider.component';

describe('CheckboxSliderComponent', () => {
  let component: CheckboxSliderComponent;
  let fixture: ComponentFixture<CheckboxSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
