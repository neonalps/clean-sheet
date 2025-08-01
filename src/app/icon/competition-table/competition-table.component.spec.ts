import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionTableComponent } from './competition-table.component';

describe('CompetitionTableComponent', () => {
  let component: CompetitionTableComponent;
  let fixture: ComponentFixture<CompetitionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
