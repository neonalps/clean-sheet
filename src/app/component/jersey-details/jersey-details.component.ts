import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ShirtSelectorComponent } from '@src/app/component/shirt-selector/shirt-selector.component';
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-jersey-details',
  imports: [CommonModule, ShirtSelectorComponent],
  templateUrl: './jersey-details.component.html'
})
export class JerseyDetailsComponent {

  private readonly translationService = inject(TranslationService);

  readonly selectedShirt = signal<number | null>(null);
  
  readonly historyText = computed(() => {
    const shirt = this.selectedShirt();
    return shirt ? this.translationService.translate(`shirtHistory.forShirt`, { shirt }) : '';
  });

  onShirtSelect(shirt: number) {
    this.selectedShirt.set(shirt);
  }

}
