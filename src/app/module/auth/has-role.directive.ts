import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { AuthService } from './service';
import { AccountRole } from '@src/app/model/auth';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasRole(role: string | string[]) {
    if (Array.isArray(role)) {
        throw new Error(`Arrays are currently not supported`);
    }

    const isAllowed = this.authService.hasRole(role as AccountRole);

    if (isAllowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!isAllowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}