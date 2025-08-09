import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Modal, ModalService } from '@src/app/module/modal/service';
import { StatsModalComponent } from "@src/app/component/stats-modal/stats-modal.component";
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modals',
  imports: [CommonModule, StatsModalComponent],
  templateUrl: './modals.component.html',
  styleUrl: './modals.component.css'
})
export class ModalsComponent implements OnInit, OnDestroy {

  isActive = signal(false);

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.active$
      .pipe(takeUntil(this.destroy$))
      .subscribe(active => {
        this.isActive.set(active);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isStatsModalActive() {
    return this.modalService.modalType() === Modal.Stats;
  }

}
