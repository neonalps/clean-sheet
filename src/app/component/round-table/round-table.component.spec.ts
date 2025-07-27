import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundTableComponent } from './round-table.component';

describe('RoundTableComponent', () => {
  let component: RoundTableComponent;
  let fixture: ComponentFixture<RoundTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoundTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
