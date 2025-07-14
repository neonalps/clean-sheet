import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Toast, ToastService } from '@src/app/module/toast/service';
import { Observable } from 'rxjs';
import { ToastComponent } from '@src/app/component/toast/toast.component';

@Component({
  selector: 'app-toasts',
  imports: [CommonModule, ToastComponent],
  templateUrl: './toasts.component.html',
  styleUrl: './toasts.component.css'
})
export class ToastsComponent implements OnInit {

  toasts$!: Observable<Toast[]>;

  private readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.toasts$ = this.toastService.getToastsObservable();
  }

}
