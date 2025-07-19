import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';

export type ButtonType = 'success';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Input() buttonType!: ButtonType;

  @Output() onClicked = new EventEmitter<void>();

  enabled = input.required<boolean>();

  onClick() {
    this.onClicked.next();
  }

}
