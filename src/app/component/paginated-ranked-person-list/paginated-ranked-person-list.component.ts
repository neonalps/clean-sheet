import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { RankedPersonItem } from '@src/app/model/dashboard';
import { ScrollNearEndDirective } from "@src/app/directive/scroll-near-end/scroll-near-end.directive";
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, throttleTime } from 'rxjs';
import { PlayerIconComponent } from "@src/app/component/player-icon/player-icon.component";

@Component({
  selector: 'app-paginated-ranked-person-list',
  imports: [CommonModule, ScrollNearEndDirective, PlayerIconComponent],
  templateUrl: './paginated-ranked-person-list.component.html',
  styleUrl: './paginated-ranked-person-list.component.css'
})
export class PaginatedRankedPersonListComponent implements OnInit, OnDestroy {

  readonly listItems = input.required<Array<RankedPersonItem>>();

  readonly nearEndReached = output<void>();

  private readonly destroy$ = new Subject<void>();
  private readonly nearEnd$ = new Subject<void>();

  ngOnInit(): void {
    // we want to immediately emit a value when the user comes near the end of the scrollable page, but then not emit for a while in order to avoid multiple API fetches
    this.nearEnd$.pipe(
      throttleTime(300),
      takeUntil(this.destroy$),
    ).subscribe({
      next: () => this.nearEndReached.emit(),
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNearEndReached(): void {
    this.nearEnd$.next();
  }

}
