import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {

  @Output() onClicked = new EventEmitter<void>();

  enabled = input.required<boolean>();

  onClick() {
    this.onClicked.next();
  }

}
