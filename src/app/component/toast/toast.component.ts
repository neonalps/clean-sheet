import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, input, signal } from '@angular/core';
import { Toast } from '@src/app/module/toast/service';
import { assertUnreachable } from '@src/app/util/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html'
})
export class ToastComponent implements AfterViewInit {

  private static readonly CLASS_FADE_HIDDEN = 'hidden-fade';

  readonly toast = input.required<Toast>();

  readonly backgroundColor = signal('');
  readonly dynamicClasses = signal([ToastComponent.CLASS_FADE_HIDDEN]);

  readonly backgroundClass = computed(() => {
    const toastType = this.toast().type;
    switch (toastType) {
      case 'success':
        return `bg-color-success`;
      case 'error':
        return 'bg-color-danger';
      case 'info':
        return 'bg-color-info';
      case 'warn':
        return 'bg-color-warn';
      default:
        assertUnreachable(toastType);
    }
  });

  ngAfterViewInit(): void {
    this.backgroundColor.set(this.backgroundClass());

    setTimeout(() => {
      this.dynamicClasses.set([this.backgroundColor()]);

      setTimeout(() => {
        this.dynamicClasses.set([this.backgroundColor(), ToastComponent.CLASS_FADE_HIDDEN]);
      }, this.toast().durationMs);
    }, 0);
  }

}
