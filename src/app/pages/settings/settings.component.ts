import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { SelectComponent } from '@src/app/component/select/select.component';
import { TabGroupComponent } from '@src/app/component/tab-group/tab-group.component';
import { TabItemComponent } from '@src/app/component/tab-item/tab-item.component';
import { AccountProfile, DateFormat, Language, ScoreFormat } from '@src/app/model/account';
import { AccountService } from '@src/app/module/account/service';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ensureNotNullish, getHtmlInputElementFromEvent } from '@src/app/util/common';
import { replaceHash } from '@src/app/util/router';
import { BehaviorSubject, combineLatest, map, merge, Observable, of, Subject, takeUntil } from 'rxjs';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { ToastService } from '@src/app/module/toast/service';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { AuthResponse, ProfileSettings } from '@src/app/model/auth';
import { LocalStorageStorageProvider } from '@src/app/module/storage/local-storage';
import { AuthService } from '@src/app/module/auth/service';

export const KEY_ACCOUNT_PROFILE_SETTINGS = "profileSettings";

@Component({
  selector: 'app-settings',
  imports: [CommonModule, I18nPipe, TabGroupComponent, TabItemComponent, SelectComponent, ButtonComponent, LoadingComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {

  activeTab$ = new BehaviorSubject<string | null>(null);

  readonly isLoading = signal(true);
  readonly isSubmitting = signal(false);
  readonly accountProfile = signal<AccountProfile | null>(null);

  readonly currentAccountProfile = signal<ProfileSettings | null>(null);
  readonly storedAccountProfile = signal<ProfileSettings | null>(null);

  readonly pushEmail$ = new BehaviorSubject<string>('');
  readonly pushFirstName$ = new BehaviorSubject<string>('');
  readonly pushLastName$ = new BehaviorSubject<string>('');
  readonly pushLanguage$ = new BehaviorSubject<SelectOption | null>(null);
  readonly pushDateFormat$ = new BehaviorSubject<SelectOption | null>(null);
  readonly pushScoreFormat$ = new BehaviorSubject<SelectOption | null>(null);

  private readonly dateFormatOptions: SelectOption[] = [
    { id: 'br', name: 'Sat, 24 May 2025 - 17:00' },
    { id: 'us', name: 'Sat, May 24 2025 - 17:00' },
    { id: 'eu', name: 'Sa, 24.05.2025 - 17:00' },
  ];
  private readonly scoreFormatOptions: SelectOption[] = [
    { id: 'colon', name: '3:1' },
    { id: 'hyphen', name: '3-1' },
  ];
  private readonly languageOptions: SelectOption[] = [];
  private readonly selectedFirstName$ = new Subject<string>();
  private readonly selectedLastName$ = new Subject<string>();
  private readonly selectedLanguage$ = new Subject<string>();
  private readonly selectedDateFormat$ = new Subject<string>();
  private readonly selectedScoreFormat$ = new Subject<string>();

  private readonly accountService = inject(AccountService);
  private readonly localStorageService = inject(LocalStorageStorageProvider);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.languageOptions.push(...[
      { id: 'de-at', name: this.translationService.translate(`language.german`) },
      { id: 'en-gb', name: this.translationService.translate(`language.english`) },
    ]);

    combineLatest([
      this.selectedFirstName$,
      this.selectedLastName$,
      this.selectedLanguage$,
      this.selectedDateFormat$,
      this.selectedScoreFormat$,
    ]).pipe(
      takeUntil(this.destroy$),
      map(combined => ({ 
        firstName: combined[0],
        lastName: combined[1],
        language: combined[2] as Language,
        dateFormat: combined[3] as DateFormat,
        scoreFormat: combined[4] as ScoreFormat,
        }))
    ).subscribe(profileUpdate => {
      this.currentAccountProfile.set(profileUpdate);
    });

    this.loadAccountProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabSelected(tabId: string) {
    replaceHash(tabId);
  }

  getLanguageOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultLanguageOptions());
  }

  getDateFormatOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultDateFormatOptions());
  }

  getScoreFormatOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultScoreFormatOptions());
  }

  onFirstNameInputChange(event: Event) {
    this.selectedFirstName$.next(getHtmlInputElementFromEvent(event).value);
  }

  onLastNameInputChange(event: Event) {
    this.selectedLastName$.next(getHtmlInputElementFromEvent(event).value);
  }

  onLanguageSelected(id: OptionId) {
    this.selectedLanguage$.next(id.toString());
  }

  onDateFormatSelected(id: OptionId) {
    this.selectedDateFormat$.next(id.toString());
  }

  onScoreFormatSelected(id: OptionId) {
    this.selectedScoreFormat$.next(id.toString());
  }

  canSave() {
    if (this.isSubmitting()) {
      return false;
    }

    const storedProfile = this.storedAccountProfile();
    const currentProfile = this.currentAccountProfile();

    if (storedProfile === null || currentProfile === null) {
      return false;
    }

    return currentProfile.firstName !== storedProfile.firstName ||
      currentProfile.lastName !== storedProfile.lastName ||
      currentProfile.language !== storedProfile.language ||
      currentProfile.dateFormat !== storedProfile.dateFormat ||
      currentProfile.scoreFormat !== storedProfile.scoreFormat;
  }

  onSave() {
    this.isSubmitting.set(true);

    const profile = ensureNotNullish(this.currentAccountProfile());

    const currentStoredAuth = ensureNotNullish(this.localStorageService.get<AuthResponse>(AuthService.STORAGE_KEY_AUTH));
    this.localStorageService.set(AuthService.STORAGE_KEY_AUTH, {
      ...currentStoredAuth,
      profileSettings: {
        ...currentStoredAuth.profileSettings,
        firstName: profile.firstName,
        lastName: profile.lastName,
        language: profile.language,
        dateFormat: profile.dateFormat,
        scoreFormat: profile.scoreFormat,
      },
    })

    this.accountService.updateAccountProfile({
          firstName: profile.firstName ?? '',
          lastName: profile.lastName ?? '',
          language: profile.language,
          dateFormat: profile.dateFormat,
          scoreFormat: profile.scoreFormat,
    }).pipe(
      takeUntil(this.destroy$),
    ).subscribe({
      next: updatedProfile => {
        this.toastService.addToast({ type: 'success', text: this.translationService.translate('account.profileUpdate.success') });
        this.onAccountProfileLoaded(updatedProfile);
        this.isSubmitting.set(false);
      },
      error: err => {
        console.error(err);
        this.toastService.addToast({ type: 'error', text: this.translationService.translate('account.profileUpdate.failure') });
        this.isSubmitting.set(false);
      }
    });
  }

  private getDefaultLanguageOptions(): Observable<SelectOption[]> {
    return of(this.languageOptions);
  }

  private getDefaultDateFormatOptions(): Observable<SelectOption[]> {
    return of(this.dateFormatOptions);
  }

  private getDefaultScoreFormatOptions(): Observable<SelectOption[]> {
    return of(this.scoreFormatOptions);
  }

  private loadAccountProfile() {
    this.isLoading.set(true);

    this.accountService.getAccountProfile().pipe(takeUntil(this.destroy$)).subscribe(profile => {
      this.onAccountProfileLoaded(profile);
    })
  }

  private onAccountProfileLoaded(profile: AccountProfile) {
    this.accountProfile.set(profile);

    this.storedAccountProfile.set({
      firstName: profile.profileSettings.firstName ?? '',
      lastName: profile.profileSettings.lastName ?? '',
      language: profile.profileSettings.language,
      dateFormat: profile.profileSettings.dateFormat,
      scoreFormat: profile.profileSettings.scoreFormat,
    });

    // all observables must emit once so that combinedLatest will have the current state (it only emits after each observables has emitted at least once)
    this.selectedFirstName$.next(profile.profileSettings.firstName ?? '');
    this.selectedLastName$.next(profile.profileSettings.lastName ?? '');

    const selectedLanguage = this.languageOptions.find(item => item.id === profile.profileSettings.language);
    const selectedDateFormat = this.dateFormatOptions.find(item => item.id === profile.profileSettings.dateFormat);
    const selectedScoreFormat = this.scoreFormatOptions.find(item => item.id === profile.profileSettings.scoreFormat);

    this.pushEmail$.next(profile.email);

    if (profile.profileSettings.firstName) {
      this.pushFirstName$.next(profile.profileSettings.firstName);
    }

    if (profile.profileSettings.lastName) {
      this.pushLastName$.next(profile.profileSettings.lastName);
    }

    this.pushLanguage$.next(ensureNotNullish(selectedLanguage));
    this.pushDateFormat$.next(ensureNotNullish(selectedDateFormat));
    this.pushScoreFormat$.next(ensureNotNullish(selectedScoreFormat));

    this.isLoading.set(false);
  }

}
