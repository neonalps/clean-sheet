import { Component, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { UiPerson } from '@src/app/model/game';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { isDefined } from '@src/app/util/common';
import { PersonId } from '@src/app/util/domain-types';

export type LineupItem = {
  person: UiPerson;
  shirt: number;
}

@Component({
  selector: 'app-lineup-selector-person-item',
  imports: [CommonModule, UiIconComponent],
  templateUrl: './lineup-selector-person-item.component.html',
  styleUrl: './lineup-selector-person-item.component.css'
})
export class LineupSelectorPersonItemComponent {

  @Input() item!: LineupItem;

  @Output() onPersonShirtClicked = new EventEmitter<PersonId>();
  @Output() onRemove = new EventEmitter<PersonId>();

  getPersonName(): string {
    return [this.item.person.firstName, this.item.person.lastName].filter(item => isDefined(item)).join(' ');
  }

  triggerRemove() {
    this.onRemove.next(this.item.person.personId);
  }

}
