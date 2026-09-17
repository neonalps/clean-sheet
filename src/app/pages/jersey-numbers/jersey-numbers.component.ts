import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { JerseyDetailsComponent } from "@src/app/component/jersey-details/jersey-details.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

@Component({
  selector: 'app-jersey-numbers',
  imports: [CommonModule, I18nPipe, JerseyDetailsComponent],
  templateUrl: './jersey-numbers.component.html',
})
export class JerseyNumbersComponent {

}
