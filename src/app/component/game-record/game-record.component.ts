import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { Observable, Subject, takeUntil } from 'rxjs';

export type GameRecord = {
  w: number;
  d: number;
  l: number;
}

@Component({
  selector: 'app-game-record',
  imports: [CommonModule],
  templateUrl: './game-record.component.html',
  styleUrl: './game-record.component.css'
})
export class GameRecordComponent implements OnInit, OnDestroy {

  @Input() gameRecord$!: Observable<GameRecord>;

  readonly gameRecord = signal<GameRecord | null>(null);

  private readonly destroy$ = new Subject<void>();
  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    this.gameRecord$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.gameRecord.set(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getWinsText(wins: number) {
    return this.translationService.translate(`gameRecord.win${wins === 1 ? 'Singular' : 'Plural'}`);
  }

  getDrawsText(draws: number) {
    return this.translationService.translate(`gameRecord.draw${draws === 1 ? 'Singular' : 'Plural'}`);
  }

  getLossesText(losses: number) {
    return this.translationService.translate(`gameRecord.loss${losses === 1 ? 'Singular' : 'Plural'}`);
  }

}
