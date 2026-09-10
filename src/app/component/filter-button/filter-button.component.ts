import { Component, computed, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ButtonComponent, ButtonType } from "@src/app/component/button/button.component";
import { UiIconDescriptor } from '@src/app/model/icon';

@Component({
  selector: 'app-filter-button',
  imports: [ButtonComponent],
  templateUrl: './filter-button.component.html',
  styleUrl: './filter-button.component.css'
})
export class FilterButtonComponent {

  readonly filterActive = input.required<boolean>();

  readonly buttonType = computed<ButtonType>(() => this.filterActive() ? 'info' : 'ghost');
  readonly iconDescriptor = signal<UiIconDescriptor>({ type: 'standard', content: 'filter' });

  constructor() {
    toObservable(this.filterActive).pipe(takeUntilDestroyed()).subscribe({
      next: value => console.log(`filter active is now: ${value}`),
    })
  }

}
