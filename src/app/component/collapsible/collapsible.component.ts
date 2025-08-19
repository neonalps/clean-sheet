import { CommonModule } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, signal, ViewChild } from '@angular/core';
import { ChevronRightComponent } from "@src/app/icon/chevron-right/chevron-right.component";
import { Subject, takeUntil } from 'rxjs';
import { StatsPlayerStatsComponent } from '../stats-player-stats/stats-player-stats.component';

@Component({
  selector: 'app-collapsible',
  imports: [ChevronRightComponent, CommonModule],
  templateUrl: './collapsible.component.html',
  styleUrl: './collapsible.component.css'
})
export class CollapsibleComponent implements AfterContentInit, AfterViewInit, OnDestroy {

  @Input() initiallyOpen = false;

  @ViewChild('content') contentEl!: ElementRef;

  @ContentChildren(StatsPlayerStatsComponent) templates!: QueryList<StatsPlayerStatsComponent>;

  isOpen = signal<boolean>(true);

  elementMaxHeight$ = new Subject<string>();
  private hasEmitted = false;

  private readonly destroy$ = new Subject<void>();

  ngAfterContentInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.isOpen.set(this.initiallyOpen);

    if (!this.initiallyOpen) {
      this.hasEmitted = true;
      this.elementMaxHeight$.next('0px');
    }

    console.log('templates', this.templates);
    this.templates.forEach(template => {
      template.onCollapsibleToggleTriggered.pipe(takeUntil(this.destroy$)).subscribe(_ => console.log('triggered from component'));
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggle() {
    this.isOpen.set(!this.isOpen());

    if (this.isOpen()) {
      this.hasEmitted = true;
      return this.elementMaxHeight$.next(`${this.contentEl.nativeElement.scrollHeight}px`);
    } else {
      // if the collapsible was initially opened and no value has been emitted yet, we must first set the value to the current scroll height before setting it to zero to trigger the animation
      if (!this.hasEmitted) {
        this.hasEmitted = true;
        this.elementMaxHeight$.next(`${this.contentEl.nativeElement.scrollHeight}px`);
        setTimeout(() => {
            this.elementMaxHeight$.next('0px');
        }, 0);
      } else {
        this.hasEmitted = true;
        this.elementMaxHeight$.next('0px');
      }
    }
  }

}
