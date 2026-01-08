import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyGameLineupsComponent } from './modify-game-lineups.component';

describe('ModifyGameLineupsComponent', () => {
  let component: ModifyGameLineupsComponent;
  let fixture: ComponentFixture<ModifyGameLineupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifyGameLineupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyGameLineupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
