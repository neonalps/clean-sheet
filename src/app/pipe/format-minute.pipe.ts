import { Pipe, PipeTransform } from '@angular/core';
import { transformGameMinute } from '@src/app/module/game/util';

@Pipe({
  name: 'formatGameMinute',
  standalone: true,
})
export class FormatGameMinutePipe implements PipeTransform {
  transform(value: string): string {
    // TODO get suffix from user preferences
    return transformGameMinute(value, '.');
  }
}