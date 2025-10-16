import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmAddPersonComponent } from './modal-confirm-add-person.component';

describe('ModalConfirmAddPersonComponent', () => {
  let component: ModalConfirmAddPersonComponent;
  let fixture: ComponentFixture<ModalConfirmAddPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalConfirmAddPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalConfirmAddPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
