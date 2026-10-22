import { Component, computed, inject, input, output, signal } from '@angular/core';
import { UiPerson } from '@src/app/model/game';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { PersonId } from '@src/app/util/domain-types';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ContextMenuComponent, ContextMenuSection } from '@src/app/component/context-menu/context-menu.component';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { getPersonName } from '@src/app/util/domain';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';

export type LineupItem = {
  person: UiPerson;
  shirt: number;
  isCaptain?: boolean;
  forMain?: boolean;
}

@Component({
  selector: 'app-lineup-selector-person-item',
  imports: [CommonModule, CdkDrag, UiIconComponent, ContextMenuComponent, I18nPipe],
  templateUrl: './lineup-selector-person-item.component.html',
  styleUrl: './lineup-selector-person-item.component.css'
})
export class LineupSelectorPersonItemComponent {

  private readonly translationService = inject(TranslationService);

  readonly item = input.required<LineupItem>();
  readonly hasCaptain = input.required<boolean>();
  readonly hasShirt = input.required<boolean>();

  readonly onSetCaptain = output<PersonId>();
  readonly onPersonShirtClicked = output<PersonId>();
  readonly onRemove = output<PersonId>();

  readonly isDragging = signal(false);

  readonly personName = computed(() => getPersonName(this.item().person));

  readonly contextMenuOptions = computed<ContextMenuSection[]>(() => {
    const menuOptions: ContextMenuSection[] = [];

    if (this.hasCaptain() && !this.item().isCaptain) {
      menuOptions.push({ items: [ { id: 'setCaptain', text: this.translationService.translate('lineup.captain'), iconDescriptor: { 'type': 'standard', 'content': 'captain', 'skipRelativePosition': true } } ] });
    }

    menuOptions.push({ items: [ { id: 'remove', text: this.translationService.translate('action.remove'), iconDescriptor: { 'type': 'standard', 'content': 'delete' } } ] });

    return menuOptions;
  });

  onContextMenuItemSelected(action: string) {
    const personId = this.item().person.personId;
    if (action === 'remove') {
      this.onRemove.emit(personId);
    } else if (action === 'setCaptain') {
      this.onSetCaptain.emit(personId); 
    }
  }

}
