import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { UiPerson } from '@src/app/model/game';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { PersonId } from '@src/app/util/domain-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ContextMenuComponent, ContextMenuSection } from '@src/app/component/context-menu/context-menu.component';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getPersonName } from '@src/app/util/domain';

export type LineupItem = {
  person: UiPerson;
  shirt: number;
  isCaptain?: boolean;
}

@Component({
  selector: 'app-lineup-selector-person-item',
  imports: [CommonModule, CdkDrag, UiIconComponent, ContextMenuComponent],
  templateUrl: './lineup-selector-person-item.component.html',
  styleUrl: './lineup-selector-person-item.component.css'
})
export class LineupSelectorPersonItemComponent implements OnInit {

  @Input() item!: LineupItem;
  @Input() hasCaptain!: boolean;
  @Input() hasShirt!: boolean;

  @Output() onSetCaptain = new EventEmitter<PersonId>();
  @Output() onPersonShirtClicked = new EventEmitter<PersonId>();
  @Output() onRemove = new EventEmitter<PersonId>();

  readonly contextMenuOptions = new BehaviorSubject<ContextMenuSection[]>([]);
  readonly personName = signal<string>('');
  readonly isDragging = signal(false);

  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    this.personName.set(getPersonName(this.item.person));

    const menuOptions: ContextMenuSection[] = [];

    if (this.hasCaptain && this.item.isCaptain !== true) {
      menuOptions.push({ items: [ { id: 'setCaptain', text: this.translationService.translate('lineup.captain'), iconDescriptor: { 'type': 'standard', 'content': 'captain', 'skipRelativePosition': true } } ] });
    }

    menuOptions.push({ items: [ { id: 'remove', text: this.translationService.translate('action.remove'), iconDescriptor: { 'type': 'standard', 'content': 'delete' } } ] });

    this.contextMenuOptions.next(menuOptions);
  }

  onContextMenuItemSelected(action: string) {
    const personId = this.item.person.personId;
    if (action === 'remove') {
      this.onRemove.next(personId);
    } else if (action === 'setCaptain') {
      this.onSetCaptain.next(personId); 
    }
  }

}
