import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
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

}
