import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TabGroupComponent } from '@src/app/component/tab-group/tab-group.component';
import { TabItemComponent } from '@src/app/component/tab-item/tab-item.component';
import { AccountProfile } from '@src/app/model/account';
import { AccountService } from '@src/app/module/account/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { replaceHash } from '@src/app/util/router';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, I18nPipe, TabGroupComponent, TabItemComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {

  activeTab$ = new BehaviorSubject<string | null>(null);

  readonly isLoading = signal(true);
  readonly accountProfile = signal<AccountProfile | null>(null);

  private readonly accountService = inject(AccountService);
  private readonly destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.loadAccountProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabSelected(tabId: string) {
    replaceHash(tabId);
  }

  private loadAccountProfile() {
    this.isLoading.set(true);

    this.accountService.getAccountProfile().pipe(takeUntil(this.destroy$)).subscribe(profile => {
      this.accountProfile.set(profile);
      this.isLoading.set(false);

      console.log('profile', profile);
    })
  }

}
