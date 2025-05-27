import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldWithBallComponent } from './field-with-ball.component';

describe('FieldWithBallComponent', () => {
  let component: FieldWithBallComponent;
  let fixture: ComponentFixture<FieldWithBallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldWithBallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldWithBallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
