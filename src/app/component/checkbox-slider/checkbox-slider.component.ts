import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-checkbox-slider',
  imports: [CommonModule, I18nPipe],
  templateUrl: './checkbox-slider.component.html',
  styleUrl: './checkbox-slider.component.css'
})
export class CheckboxSliderComponent {

  @Input() checked = false;
  @Input() showText = false;
  @Output() readonly valueChange = new EventEmitter<boolean>();

  @ViewChild('check', { static: false }) checkbox!: ElementRef;

  onChange() {
    // the timeout should be the duration of the transition (defined in the component's css file)
    // if it is shorter, the transition is aborted
    setTimeout(() => this.valueChange.next(!this.checked), 300);
  }

  onTextClicked() {
    this.checkbox.nativeElement.checked = !this.checked;
    this.onChange();
  }

}
