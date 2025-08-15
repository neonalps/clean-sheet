import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRecordComponent } from './game-record.component';

describe('GameRecordComponent', () => {
  let component: GameRecordComponent;
  let fixture: ComponentFixture<GameRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameRecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
