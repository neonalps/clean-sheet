import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalGameListFilterComponent } from './modal-game-list-filter.component';

describe('ModalGameListFilterComponent', () => {
  let component: ModalGameListFilterComponent;
  let fixture: ComponentFixture<ModalGameListFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalGameListFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalGameListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
