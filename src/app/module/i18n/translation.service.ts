import { Injectable } from '@angular/core';
import de from "./locales/de.json";
import en from "./locales/en.json";
import { isDefined } from '@src/app/util/common';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private static readonly LOCALE_DE = "de";
  private static readonly LOCALE_EN = "en";

  private static readonly LOCALES = new Map<string, Record<string, string>>([
    [TranslationService.LOCALE_EN, en],
    [TranslationService.LOCALE_DE, de],
  ]);

  private static readonly DEFAULT_LOCALE = TranslationService.LOCALE_EN;

  private selectedLocale: string | null = null;

  constructor() { }

  translate(key: string): string {
    const localeMap: Record<string, string> | undefined = TranslationService.LOCALES.get(this.getLocale());
    if (localeMap === undefined) {
      throw new Error(`Selected locale ${this.getLocale()} does not seem to be properly registered`);
    }

    const value: string | null | undefined = localeMap[key];
    return isDefined(value) ? value : `Missing translation for key ${key}`;
  }

  private getLocale(): string {
    return this.selectedLocale !== null ? this.selectedLocale : TranslationService.DEFAULT_LOCALE;
  }
}
