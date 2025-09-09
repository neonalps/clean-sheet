import { inject, Pipe, PipeTransform } from '@angular/core';
import { ScoreFormatter } from '@src/app/module/game/score-formatter';
import { ScoreTuple } from '@src/app/model/game';

@Pipe({
  name: 'formatGameMinute',
  standalone: true,
})
export class FormatGameScorePipe implements PipeTransform {

  private readonly scoreFormatter = inject(ScoreFormatter);

  transform(score?: ScoreTuple | null): string {
    return this.scoreFormatter.format(score);
  }
}