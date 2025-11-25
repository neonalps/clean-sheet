import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { StarIconComponent } from "@src/app/icon/star/star.component";
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';

@Component({
  selector: 'app-checkbox-star',
  imports: [CommonModule, StarIconComponent],
  templateUrl: './checkbox-star.component.html',
  styleUrl: './checkbox-star.component.css'
})
export class CheckboxStarComponent {

  checked = input.required<boolean>();
  color = input(KEYWORD_CURRENT_COLOR);
  disabled = input(false);
  displayText = input<string | null>(null);
  
  onClick = output<void>();

  onClicked() {
    if (this.disabled()) {
      return;
    }

    this.onClick.emit();
  }

}
