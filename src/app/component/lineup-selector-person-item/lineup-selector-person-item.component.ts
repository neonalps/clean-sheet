import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { UiPerson } from '@src/app/model/game';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { isDefined } from '@src/app/util/common';
import { PersonId } from '@src/app/util/domain-types';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CdkDrag } from '@angular/cdk/drag-drop';

export type LineupItem = {
  person: UiPerson;
  shirt: number;
}

@Component({
  selector: 'app-lineup-selector-person-item',
  imports: [CommonModule, CdkDrag, UiIconComponent, I18nPipe],
  templateUrl: './lineup-selector-person-item.component.html',
  styleUrl: './lineup-selector-person-item.component.css'
})
export class LineupSelectorPersonItemComponent implements OnInit {

  @HostBinding('attr.x-person-id') hostPersonId: PersonId | null = null;

  @Input() item!: LineupItem;

  @Output() onPersonShirtClicked = new EventEmitter<PersonId>();
  @Output() onRemove = new EventEmitter<PersonId>();

  ngOnInit(): void {
    this.hostPersonId = this.item.person.personId;
  }

  getPersonName(): string {
    return [this.item.person.firstName, this.item.person.lastName].filter(item => isDefined(item)).join(' ');
  }

  triggerRemove() {
    this.onRemove.next(this.item.person.personId);
  }

}
