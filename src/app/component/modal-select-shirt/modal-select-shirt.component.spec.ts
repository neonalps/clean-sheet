import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSelectShirtComponent } from './modal-select-shirt.component';

describe('ModalSelectShirtComponent', () => {
  let component: ModalSelectShirtComponent;
  let fixture: ComponentFixture<ModalSelectShirtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSelectShirtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSelectShirtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
