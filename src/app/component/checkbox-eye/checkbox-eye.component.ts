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
