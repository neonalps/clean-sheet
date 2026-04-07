import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShirtDistributionComponent } from './shirt-distribution.component';

describe('ShirtDistributionComponent', () => {
  let component: ShirtDistributionComponent;
  let fixture: ComponentFixture<ShirtDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShirtDistributionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShirtDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
