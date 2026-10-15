import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-checkbox-slider',
  imports: [CommonModule, I18nPipe],
  templateUrl: './checkbox-slider.component.html',
  styleUrl: './checkbox-slider.component.css'
})
export class CheckboxSliderComponent {

  readonly checkboxElement = viewChild.required<ElementRef<HTMLInputElement>>('check');

  readonly checked = input(false);
  readonly showText = input(false);
  readonly overrideText = input<string>();
  readonly valueChangeDelayMs = input(300);

  readonly valueChange = output<boolean>();

  onChange() {
    // the timeout should be the duration of the transition (defined in the component's css file)
    // if it is shorter, the transition is aborted
    setTimeout(() => this.valueChange.emit(!this.checked()), this.valueChangeDelayMs());
  }

  onTextClicked() {
    this.checkboxElement().nativeElement.checked = !this.checked();
    this.onChange();
  }

}
