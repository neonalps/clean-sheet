import { Injectable } from '@angular/core';
import de from "./locales/de.json";
import en from "./locales/en.json";
import { isNotDefined } from '@src/app/util/common';
import { Locale } from './locales/locale';

export type Ordinal = {
  ordinalValue: number;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  private static readonly LOCALES = new Map<string, Record<string, string>>([
    [Locale.English, en],
    [Locale.German, de],
  ]);

  private static readonly DEFAULT_LOCALE = Locale.English;

  private selectedLocale: Locale | null = null;

  translate(key: string, args: Record<string, string | number | Ordinal> = {}): string {
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
      let value = argValue;
      if (typeof argValue === 'object') {
        // ordinal
        value = this.resolveOrdinal(argValue.ordinalValue);
      }

      resolvedValue = resolvedValue.replaceAll(`{${argKey}}`, `${value}`);
    }
    
    return resolvedValue;
  }

  private getLocale(): string {
    return this.selectedLocale !== null ? this.selectedLocale : TranslationService.DEFAULT_LOCALE;
  }

  private resolveOrdinal(value: number): string {
    if (this.getLocale() === Locale.German) {
      return `${value}`;
    }

    // english
    if (value % 10 > 3 || [11, 12, 13].includes(value)) {
      return `${value}th`;
    } else if (value % 10 === 1) {
      return `${value}st`;
    } else if (value % 10 === 2) {
      return `${value}nd`;
    } else {
      return `${value}rd`;
    }
  }
}
