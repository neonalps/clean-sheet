import { Injectable } from '@angular/core';
import de from "./locales/de.json";
import en from "./locales/en.json";
import { isDefined, isNotDefined } from '@src/app/util/common';
import { Locale } from './locales/locale';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private static readonly LOCALES = new Map<string, Record<string, string>>([
    [Locale.English, en],
    [Locale.German, de],
  ]);

  private static readonly DEFAULT_LOCALE = Locale.German;

  private selectedLocale: Locale | null = null;

  translate(key: string, args: Record<string, string | number> = {}): string {
    const localeMap: Record<string, string> | undefined = TranslationService.LOCALES.get(this.getLocale());
    if (localeMap === undefined) {
      throw new Error(`Selected locale ${this.getLocale()} does not seem to be registered`);
    }

    const value: string | null | undefined = localeMap[key];

    if (isNotDefined(value)) {
      return `Missing translation for key ${key}`;
    }

    let resolvedValue = value;
    for (const [argKey, argValue] of Object.entries(args)) {
      resolvedValue = resolvedValue.replaceAll(`{${argKey}}`, `${argValue}`);
    }
    
    return resolvedValue;
  }

  private getLocale(): string {
    return this.selectedLocale !== null ? this.selectedLocale : TranslationService.DEFAULT_LOCALE;
  }
}
