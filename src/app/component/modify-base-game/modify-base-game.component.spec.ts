import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyBaseGameComponent } from './modify-base-game.component';

describe('ModifyBaseGameComponent', () => {
  let component: ModifyBaseGameComponent;
  let fixture: ComponentFixture<ModifyBaseGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyBaseGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyBaseGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
