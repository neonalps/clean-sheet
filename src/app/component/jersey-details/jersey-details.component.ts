import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ShirtSelectorComponent } from '@src/app/component/shirt-selector/shirt-selector.component';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { StatsService } from '@src/app/module/stats/service';
import { Shirt } from '@src/app/util/domain-types';
import { take } from 'rxjs';
import { ShirtWornBy } from '@src/app/model/stats';
import { PersonCardComponent } from '@src/app/component/person-card/person-card.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { EmptyStateComponent } from '@src/app/component/empty-state/empty-state.component';
import { UiIconComponent } from '../ui-icon/icon.component';

@Component({
  selector: 'app-jersey-details',
  imports: [CommonModule, ShirtSelectorComponent, PersonCardComponent, I18nPipe, EmptyStateComponent, UiIconComponent],
  templateUrl: './jersey-details.component.html'
})
export class JerseyDetailsComponent {

  private readonly statsService = inject(StatsService);
  private readonly translationService = inject(TranslationService);

  readonly isLoading = signal(false);
  readonly selectedShirt = signal<number | null>(null);
  readonly shirtWornBy = signal<ShirtWornBy[]>([]);
  
  readonly historyText = computed(() => {
    const shirt = this.selectedShirt();
    return shirt ? this.translationService.translate(`shirtHistory.forShirt`, { shirt }) : '';
  });

  onShirtSelect(shirt: Shirt) {
    this.selectedShirt.set(shirt);
    this.loadShirtStats(shirt);
  }

  loadShirtStats(shirt: Shirt) {
    this.isLoading.set(true);
    this.shirtWornBy.set([]);
    this.statsService.getShirtStats(shirt, 'temporal').pipe(
      take(1),
    ).subscribe({
      next: response => {
        this.shirtWornBy.set(response.wornBy);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
      }
    })
  }

}
