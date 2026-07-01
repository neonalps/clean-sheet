import { Component, computed, input } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-contract-icon',
  imports: [],
  templateUrl: './contract.component.html',
})
export class ContractIconComponent {

  color = input<string>();

  effectiveColor = computed(() => {
    return this.color() ?? KEYWORD_CURRENT_COLOR;
  });

}
