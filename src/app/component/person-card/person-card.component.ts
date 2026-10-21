import { Component, computed, input, output } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { Person } from '@src/app/model/person';
import { NationalitiesComponent } from '@src/app/component/nationalities/nationalities.component';
import { Nullish } from '@src/app/util/types';

@Component({
  selector: 'app-person-card',
  imports: [CommonModule, UiIconComponent, NationalitiesComponent],
  templateUrl: './person-card.component.html',
})
export class PersonCardComponent {

  readonly person = input.required<Person>();
  readonly onClick = output<Person>();

  readonly iconContainerWidth = input('width-md');
  readonly iconMargin = input('mr-2');
  readonly lastNameBold = input(true);
  readonly showNationalities = input(false);
  readonly textSize = input('text-base');
  readonly clickable = input(false);
  
  readonly nationalities = computed<Nullish<string[]>>(() => this.person().nationalities);

  handleClick(): void {
    if (this.clickable() !== true) {
      return;
    }

    this.onClick.emit(this.person());
  }

}
