import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Toast } from '@src/app/module/toast/service';
import { assertUnreachable } from '@src/app/util/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent implements AfterViewInit {

  private static readonly CLASS_FADE_HIDDEN = 'hidden-fade';

  @Input() toast!: Toast;

  readonly dynamicClasses$ = new BehaviorSubject<string[]>([ToastComponent.CLASS_FADE_HIDDEN]);
  private bgColor!: string;

  ngAfterViewInit(): void {
    this.bgColor = this.getBackgroundClass();

    setTimeout(() => {
      // publish an empty dynamic classes array so the toast can fade in
      this.dynamicClasses$.next([this.bgColor]);

      setTimeout(() => {
        this.dynamicClasses$.next([this.bgColor, ToastComponent.CLASS_FADE_HIDDEN]);
      }, this.toast.durationMs);
    }, 0);
  }

  private getBackgroundClass(): string {
    switch (this.toast.type) {
      case 'success':
        return `bg-color-success`;
      case 'error':
        return 'bg-color-danger';
      case 'info':
        return 'bg-color-info';
      case 'warn':
        return 'bg-color-warn';
      default:
        assertUnreachable(this.toast.type);
    }
  }

}
