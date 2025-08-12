import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFlagComponent } from './main-flag.component';

describe('MainFlagComponent', () => {
  let component: MainFlagComponent;
  let fixture: ComponentFixture<MainFlagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainFlagComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainFlagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
