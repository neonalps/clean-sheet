import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Account } from '@src/app/model/account';
import { AccountService } from '@src/app/module/account/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { isDefined } from '@src/app/util/common';
import { BehaviorSubject, delay, Subject, takeUntil } from 'rxjs';
import { LabelComponent } from "@src/app/component/label/label.component";
import { AuthService } from '@src/app/module/auth/service';
import { getRandomNumberBetween } from '@src/app/util/random';

export type UserInfo = Account & { myself?: boolean };

@Component({
  selector: 'app-user-list',
  imports: [CommonModule, I18nPipe, LabelComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit, OnDestroy {

  skeletonRows = [...Array(getRandomNumberBetween(3, 12)).keys()];

  readonly users$ = new BehaviorSubject<UserInfo[]>([]);
  readonly isLoading = signal(true);

  private readonly accounts: Account[] = [];

  private readonly accountService = inject(AccountService);
  private readonly authService = inject(AuthService);

  private readonly destroy$ = new Subject<void>();

  private loggedInUserId: string | null = null;

  ngOnInit(): void {
    this.authService.authIdentity$.pipe(takeUntil(this.destroy$)).subscribe(identity => {
      if (identity === null) {
        this.loggedInUserId = null;
        return;
      }

      this.loggedInUserId = identity.publicId;
    })

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

  getUserName(account: Account) {
    return [
      account.firstName,
      account.lastName
    ].filter(item => isDefined(item)).join(' ');
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
            myself: item.publicId === this.loggedInUserId,
          }
        });

        this.accounts.push(...incomingItems);
        this.users$.next(this.accounts);
        this.isLoading.set(false);
      });
  }

}
