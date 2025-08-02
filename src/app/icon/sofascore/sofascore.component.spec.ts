import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SofascoreComponent } from './sofascore.component';

describe('SofascoreComponent', () => {
  let component: SofascoreComponent;
  let fixture: ComponentFixture<SofascoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SofascoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SofascoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
