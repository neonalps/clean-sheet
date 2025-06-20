import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphIconComponent } from './graph.component';

describe('GraphComponent', () => {
  let component: GraphIconComponent;
  let fixture: ComponentFixture<GraphIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraphIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
