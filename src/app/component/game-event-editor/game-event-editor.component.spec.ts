import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventEditorComponent } from './game-event-editor.component';

describe('GameEventEditorComponent', () => {
  let component: GameEventEditorComponent;
  let fixture: ComponentFixture<GameEventEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEventEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEventEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
