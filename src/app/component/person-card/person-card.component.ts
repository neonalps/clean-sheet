import { Component, input } from '@angular/core';
import { UiIconComponent } from "../ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { Person } from '@src/app/model/person';

@Component({
  selector: 'app-person-card',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './person-card.component.html',
})
export class PersonCardComponent {

  readonly lastNameBold = input(true);
  readonly iconContainerWidth = input('width-md');
  readonly person = input.required<Person>();

}
