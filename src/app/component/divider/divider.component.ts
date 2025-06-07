import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-divider',
  imports: [CommonModule],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.css'
})
export class DividerComponent {

  @Input() text!: string;
  @Input() bgColor: string | undefined;
  @Input() textSize: string | undefined;
  @Input() isTransparent = false;
  @Input() additionalClasses: string | undefined;

  getBgColor(): string {
    return this.bgColor ?? "bg-color-dark-grey-darker";
  }

  getTextSize(): string {
    return this.textSize ?? "text-sm";
  }

  getAdditionalClasses(): string {
    return this.additionalClasses ?? "";
  }

}
