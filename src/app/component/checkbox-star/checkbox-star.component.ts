import { Component, computed, input, output } from '@angular/core';
import { StarIconComponent } from "@src/app/icon/star/star.component";
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-checkbox-star',
  imports: [StarIconComponent],
  templateUrl: './checkbox-star.component.html'
})
export class CheckboxStarComponent {

  readonly checked = input.required<boolean>();
  readonly disabled = input(false);
  readonly displayText = input<string | null>(null);

  readonly effectiveFillColor = computed(() => this.checked() ? KEYWORD_CURRENT_COLOR : undefined);
  
  readonly onClick = output<void>();

  onClicked() {
    if (this.disabled()) {
      return;
    }

    this.onClick.emit();
  }

}
