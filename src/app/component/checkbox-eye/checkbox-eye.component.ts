import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { KEYWORD_CURRENT_COLOR } from '@src/styles/constants';
import { EyeIconComponent } from "@src/app/icon/eye/eye.component";
import { EyeSlashIconComponent } from "@src/app/icon/eye-slash/eye-slash.component";

@Component({
  selector: 'app-checkbox-eye',
  imports: [CommonModule, EyeIconComponent, EyeSlashIconComponent],
  templateUrl: './checkbox-eye.component.html',
  styleUrl: './checkbox-eye.component.css'
})
export class CheckboxEyeComponent {

  readonly checked = input.required<boolean>();
  readonly color = input(KEYWORD_CURRENT_COLOR);
  readonly disabled = input(false);
  readonly displayText = input<string | null>(null);
  
  readonly onClick = output<void>();

  onClicked() {
    if (this.disabled()) {
      return;
    }

    this.onClick.emit();
  }

}
