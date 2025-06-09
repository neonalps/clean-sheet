import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceholderPersonComponent } from './placeholder-person.component';

describe('PlaceholderPersonComponent', () => {
  let component: PlaceholderPersonComponent;
  let fixture: ComponentFixture<PlaceholderPersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceholderPersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaceholderPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
