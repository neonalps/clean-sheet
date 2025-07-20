import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptySearchOptionComponent } from './empty-search-option.component';

describe('EmptySearchOptionComponent', () => {
  let component: EmptySearchOptionComponent;
  let fixture: ComponentFixture<EmptySearchOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptySearchOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptySearchOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
