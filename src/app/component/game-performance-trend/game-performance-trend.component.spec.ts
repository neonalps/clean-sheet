import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePerformanceTrendComponent } from './game-performance-trend.component';

describe('GamePerformanceTrendComponent', () => {
  let component: GamePerformanceTrendComponent;
  let fixture: ComponentFixture<GamePerformanceTrendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePerformanceTrendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamePerformanceTrendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
