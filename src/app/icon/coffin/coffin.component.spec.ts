import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffinComponent } from './coffin.component';

describe('CoffinComponent', () => {
  let component: CoffinComponent;
  let fixture: ComponentFixture<CoffinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoffinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoffinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
