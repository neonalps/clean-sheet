import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ShirtSelectorComponent } from '@src/app/component/shirt-selector/shirt-selector.component';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { StatsService } from '@src/app/module/stats/service';
import { Shirt } from '@src/app/util/domain-types';
import { take } from 'rxjs';
import { CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-jersey-details',
  imports: [CommonModule, ShirtSelectorComponent],
  templateUrl: './jersey-details.component.html'
})
export class JerseyDetailsComponent {

  private readonly statsService = inject(StatsService);
  private readonly translationService = inject(TranslationService);

  readonly isLoading = signal(false);
  readonly selectedShirt = signal<number | null>(null);
  
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
    this.statsService.getShirtStats(shirt, 'temporal').pipe(
      take(1),
    ).subscribe({
      next: response => {
        console.log(response.wornBy);
        this.isLoading.set(false);
      },
      error: err => {
        console.error(err);
        this.isLoading.set(false);
      }
    })
  }

}
