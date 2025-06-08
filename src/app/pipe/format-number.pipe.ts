import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatNumber',
  standalone: true,
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: any): string | number | undefined {
    if (value === 0) {
      return 0;
    }
    if (!value) {
      return;
    }
    
    return new Intl.NumberFormat("de-DE").format(value);
  }
}