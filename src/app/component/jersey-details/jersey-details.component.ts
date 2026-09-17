import { Component, signal } from '@angular/core';
import { ShirtSelectorComponent } from '@src/app/component/shirt-selector/shirt-selector.component';

@Component({
  selector: 'app-jersey-details',
  imports: [ShirtSelectorComponent],
  templateUrl: './jersey-details.component.html'
})
export class JerseyDetailsComponent {

  readonly selectedShirt = signal<number | null>(null);

}
