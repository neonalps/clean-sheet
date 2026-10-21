import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Toast, ToastService } from '@src/app/module/toast/service';
import { Subject, takeUntil } from 'rxjs';
import { ToastComponent } from '@src/app/component/toast/toast.component';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule, ToastComponent],
  templateUrl: './toasts.component.html'
})
export class ToastsComponent implements OnInit, OnDestroy {

  readonly toasts = signal<Toast[]>([]);

  private readonly toastService = inject(ToastService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.toastService.getToastsObservable()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: toastsValue => this.toasts.set([...toastsValue]),
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
