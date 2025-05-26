import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubIconComponent } from './club-icon.component';

describe('ClubIconComponent', () => {
  let component: ClubIconComponent;
  let fixture: ComponentFixture<ClubIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClubIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClubIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
