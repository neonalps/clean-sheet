import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OAuthHandlerComponent } from './oauth-handler.component';

describe('OauthHandlerComponent', () => {
  let component: OAuthHandlerComponent;
  let fixture: ComponentFixture<OAuthHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthHandlerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OAuthHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
