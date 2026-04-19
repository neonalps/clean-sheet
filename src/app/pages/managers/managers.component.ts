import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ManagerPeriod } from '@src/app/model/manager';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ManagerPeriodService } from '@src/app/module/manager/period.service';
import { Subject, takeUntil } from 'rxjs';
import { ManagerPeriodComponent } from "@src/app/component/manager-period/manager-period.component";

@Component({
  selector: 'app-managers',
  imports: [CommonModule, I18nPipe, ManagerPeriodComponent],
  templateUrl: './managers.component.html',
})
export class ManagersComponent implements OnInit, OnDestroy {

  readonly managerPeriods = signal<ManagerPeriod[]>([]);

  private readonly managerPeriodService = inject(ManagerPeriodService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.managerPeriodService.managerPeriods$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(periods => this.managerPeriods.set(periods));

    this.managerPeriodService.fetch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
