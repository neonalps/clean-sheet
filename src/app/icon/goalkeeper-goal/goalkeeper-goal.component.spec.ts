import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalkeeperGoalComponent } from './goalkeeper-goal.component';

describe('GoalkeeperGoalComponent', () => {
  let component: GoalkeeperGoalComponent;
  let fixture: ComponentFixture<GoalkeeperGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalkeeperGoalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalkeeperGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
