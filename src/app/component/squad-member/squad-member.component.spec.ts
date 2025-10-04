import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquadMemberComponent } from './squad-member.component';

describe('SquadMemberComponent', () => {
  let component: SquadMemberComponent;
  let fixture: ComponentFixture<SquadMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SquadMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SquadMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
