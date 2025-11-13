import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalkeeperGloveComponent } from './goalkeeper-glove.component';

describe('GoalkeeperGloveComponent', () => {
  let component: GoalkeeperGloveComponent;
  let fixture: ComponentFixture<GoalkeeperGloveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoalkeeperGloveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoalkeeperGloveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
