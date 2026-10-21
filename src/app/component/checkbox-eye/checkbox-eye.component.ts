import { Component, input, output } from '@angular/core';
import { EyeIconComponent } from "@src/app/icon/eye/eye.component";
import { EyeSlashIconComponent } from "@src/app/icon/eye-slash/eye-slash.component";

@Component({
  selector: 'app-checkbox-eye',
  imports: [EyeIconComponent, EyeSlashIconComponent],
  templateUrl: './checkbox-eye.component.html'
})
export class CheckboxEyeComponent {

  readonly checked = input.required<boolean>();
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
