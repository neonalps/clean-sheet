import { inject, Pipe, PipeTransform } from '@angular/core';
import { GameMinuteFormatter } from '@src/app/module/game/minute-formatter';

@Pipe({
  name: 'formatGameMinute',
  standalone: true,
})
export class FormatGameMinutePipe implements PipeTransform {

  private readonly gameMinuteFormatter = inject(GameMinuteFormatter);

  transform(value: string): string {
    return this.gameMinuteFormatter.format(value);
  }
}