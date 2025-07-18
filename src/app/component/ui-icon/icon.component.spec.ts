import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiIconComponent } from './icon.component';

describe('IconComponent', () => {
  let component: UiIconComponent;
  let fixture: ComponentFixture<UiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
