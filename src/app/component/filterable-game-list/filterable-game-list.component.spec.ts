import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterableGameListComponent } from './filterable-game-list.component';

describe('FilterableGameListComponent', () => {
  let component: FilterableGameListComponent;
  let fixture: ComponentFixture<FilterableGameListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterableGameListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterableGameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
