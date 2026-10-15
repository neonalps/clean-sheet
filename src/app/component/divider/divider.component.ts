import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-divider',
  imports: [CommonModule],
  templateUrl: './divider.component.html'
})
export class DividerComponent {

  readonly text = input.required<string>();
  readonly bgColor = input<string>();
  readonly textSize = input<string>();
  readonly isTransparent = input(false);
  readonly additionalClasses = input<string>();

  readonly effectiveBgColor = computed(() => this.bgColor() ?? "bg-color-dark-grey-darker");
  
  readonly effectiveTextSize = computed(() => this.textSize() ?? "text-sm");

  readonly effectiveAdditionalClasses = computed(() => this.additionalClasses() ?? "");

}
