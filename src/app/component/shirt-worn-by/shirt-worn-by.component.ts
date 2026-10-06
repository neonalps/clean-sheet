import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ShirtWornBy } from '@src/app/model/stats';
import { PersonCardComponent } from '@src/app/component/person-card/person-card.component';
import { CollapsibleComponent } from '@src/app/component/collapsible/collapsible.component';

@Component({
  selector: 'app-shirt-worn-by',
  imports: [CommonModule, PersonCardComponent, CollapsibleComponent],
  templateUrl: './shirt-worn-by.component.html'
})
export class ShirtWornByComponent {

  readonly shirtWornBy = input.required<ShirtWornBy>();

  readonly detailsOpen = signal(false);

  toggle() {
    this.detailsOpen.update(current => !current);
  }

}
