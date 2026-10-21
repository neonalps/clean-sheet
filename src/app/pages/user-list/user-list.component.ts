import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Account } from '@src/app/model/account';
import { AccountService } from '@src/app/module/account/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { isDefined } from '@src/app/util/common';
import { Subject, takeUntil } from 'rxjs';
import { LabelComponent } from "@src/app/component/label/label.component";
import { AuthService } from '@src/app/module/auth/service';
import { getRandomNumberBetween } from '@src/app/util/random';
import { AccountRole } from '@src/app/model/auth';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ContextMenuComponent, ContextMenuSection } from "@src/app/component/context-menu/context-menu.component";

export type UserInfo = Account & { myself?: boolean };

@Component({
  selector: 'app-user-list',
  imports: [I18nPipe, LabelComponent, ContextMenuComponent],
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit, OnDestroy {

  private static readonly CONTEXT_MENU_KEY_DELETE_USER = "deleteUser";

  readonly skeletonRows = [...Array(getRandomNumberBetween(3, 12)).keys()];

  readonly contextMenuOptions = signal<ContextMenuSection[]>([]);
  readonly users = signal<UserInfo[]>([]);
  readonly isLoading = signal(true);

  private readonly accountService = inject(AccountService);
  private readonly authService = inject(AuthService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  private readonly loggedInUserId = signal<string | null>(null);

  ngOnInit(): void {
    this.authService.authIdentity$.pipe(takeUntil(this.destroy$)).subscribe(identity => {
      if (identity === null) {
        this.loggedInUserId.set(null);
        return;
      }

      this.loggedInUserId.set(identity.publicId);
    });

    this.contextMenuOptions.set([
      {
        items: [
          { 'id': UserListComponent.CONTEXT_MENU_KEY_DELETE_USER, 'text': this.translationService.translate('action.deleteUser'), iconDescriptor: { 'type': 'standard', 'content': 'delete' }, isDanger: true },
        ],
      },
    ]);

    this.loadAccounts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getLoginInitial(account: Account) {
    if (account.firstName) {
      return account.firstName.substring(0, 1);
    } else if (account.lastName) {
      return account.lastName.substring(0, 1);
    } else {
      return account.email.substring(0, 1);
    }
  }

  getRoleName(role: AccountRole) {
    return this.translationService.translate(`role.${role}`);
  }

  getUserName(account: Account) {
    return [
      account.firstName,
      account.lastName
    ].filter(item => isDefined(item)).join(' ');
  }

  onContextMenuItemSelected(selectedItem: string, userId: number) {
    // TODO implement
    console.log(`should perform '${selectedItem}' for user with ID ${userId}`);
  }

  private loadAccounts() {
    this.isLoading.set(true);
    this.accountService.getAccounts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(accounts => {
        // TODO properly handle pagination
        const incomingItems: UserInfo[] = accounts.items.map(item => {
          return {
            ...item,
            myself: item.publicId === this.loggedInUserId(),
          }
        });

        this.users.set(incomingItems);
        this.isLoading.set(false);
      });
  }

}
