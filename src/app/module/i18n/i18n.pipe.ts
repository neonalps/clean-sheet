import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Pipe({
  name: '$t',
  standalone: true
})
export class I18nPipe implements PipeTransform {

  constructor(private readonly translationService: TranslationService) {}

  transform(value: string, ...args: unknown[]): string {
    return this.translationService.translate(value);
  }

}
