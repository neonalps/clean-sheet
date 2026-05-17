import { Component, OnDestroy, OnInit, inject, input, output, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { GameAbsenceEditorItem, AbsenceListEditorItemComponent, EditorPerson } from '@src/app/component/absence-list-editor-item/absence-list-editor-item.component';
import { GameAbsenceType } from '@src/app/model/game';
import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, CdkDropListGroup, transferArrayItem } from '@angular/cdk/drag-drop';
import { groupBy } from '@src/app/util/array';
import { assertUnreachable } from '@src/app/util/common';
import { GameAbsenceService } from '@src/app/module/game-absence/service';
import { GameId } from '@src/app/util/domain-types';
import { ToastService } from '@src/app/module/toast/service';
import { TranslationService } from '@src/app/module/i18n/translation.service';

export type GameAbsenceDropLists = Array<GameAbsenceDropList>;

export type GameAbsenceDropList = {
  id: string;
  items: GameAbsenceEditorItem[];
  titleI18nKey: string;
}

@Component({
  selector: 'app-absence-list-editor',
  imports: [CommonModule, I18nPipe, AbsenceListEditorItemComponent, CdkDropListGroup, CdkDropList, CdkDrag],
  templateUrl: './absence-list-editor.component.html',
})
export class AbsenceListEditorComponent implements OnInit, OnDestroy {

  readonly absences = input.required<GameAbsenceEditorItem[]>();
  readonly activeSquad = input.required<EditorPerson[]>();
  readonly gameId = input.required<GameId>();
  readonly loadPotentialAbsencesPossible = input.required<boolean>();

  readonly onUpdate = output<GameAbsenceEditorItem[]>();

  readonly dropLists = signal<GameAbsenceDropLists>([]);

  readonly injuredItems = signal<GameAbsenceEditorItem[]>([]);
  readonly suspendedItems = signal<GameAbsenceEditorItem[]>([]);
  readonly atRiskItems = signal<GameAbsenceEditorItem[]>([]);
  readonly exemptItems = signal<GameAbsenceEditorItem[]> ([]);
  readonly potentialAbsencesLoaded = signal(false);

  private readonly gameAbsenceService = inject(GameAbsenceService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    const groupedInputItems = groupBy(this.absences(), (item: GameAbsenceEditorItem) => item.absenceType);
    this.injuredItems.set(groupedInputItems.get(GameAbsenceType.Injured) ?? []);
    this.suspendedItems.set(groupedInputItems.get(GameAbsenceType.Suspended) ?? []);
    this.atRiskItems.set(groupedInputItems.get(GameAbsenceType.AtRisk) ?? []);
    this.exemptItems.set(groupedInputItems.get(GameAbsenceType.Exempt) ?? []);

    this.updateDropLists();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem() {
    this.injuredItems.update(current => {
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          person: null,
          absenceType: GameAbsenceType.Injured,
          absenceReason: null,
        },
      ];
    })

    this.updateDropLists();
    this.publishUpdate();
  }

  updateItem(updatedItem: GameAbsenceEditorItem) {
    const itemsForType = this.getItemsForType(updatedItem.absenceType);
    const itemIndex = itemsForType.findIndex(item => item.id === updatedItem.id);
    if (itemIndex < 0) {
      return;
    }
    itemsForType[itemIndex] = { ...updatedItem };
    this.setItemsForType(updatedItem.absenceType, itemsForType);
   
    this.updateDropLists();
    this.publishUpdate();
  }

  loadPotentialAbsences() {
    this.potentialAbsencesLoaded.set(true);
    this.gameAbsenceService.getPotentialAbsencesForGame(this.gameId())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: potentialAbsences => {
          console.log('received potentials', potentialAbsences);
        },
        error: err => {
          console.error(err);
          this.toastService.addToast({ type: 'error', text: this.translationService.translate('gameAbsences.load.error') });
          this.potentialAbsencesLoaded.set(false);
        }
      })
  }

  removeItem(itemId: string) {
    for (const itemType of [GameAbsenceType.Injured, GameAbsenceType.Suspended, GameAbsenceType.AtRisk, GameAbsenceType.Exempt]) {
      const itemsForType = this.getItemsForType(itemType);
      const itemIndex = itemsForType.findIndex(item => item.id === itemId);
      if (itemIndex < 0) {
        continue;
      }

      itemsForType.splice(itemIndex, 1);
      this.setItemsForType(itemType, itemsForType);

      this.updateDropLists();
      this.publishUpdate();
      return;
    }
  }

  onItemDrop(event: CdkDragDrop<GameAbsenceEditorItem[]>) {
    const previousItemType = event.previousContainer.id as GameAbsenceType;
    const currentItemType = event.container.id as GameAbsenceType;

    if (event.previousContainer !== event.container) {
      // element was moved to new section
      const itemsForPreviousType = this.getItemsForType(previousItemType);
      const itemsForCurrentType = this.getItemsForType(currentItemType);
      transferArrayItem(itemsForPreviousType, itemsForCurrentType, event.previousIndex, event.currentIndex);

      // we also have to reset the reason for the moved item
      const movedItemId = (event.item as any)._parentDrag.data.id;
      const movedItemIndex = itemsForCurrentType.findIndex(item => item.id === movedItemId);
      if (movedItemIndex < 0) {
        throw new Error(`Something went wrong while moving to new section`);
      }
      itemsForCurrentType[movedItemIndex] = {
        ...itemsForCurrentType[movedItemIndex],
        absenceType: currentItemType,
        absenceReason: null,
      };

      this.setItemsForType(previousItemType, itemsForPreviousType);
      this.setItemsForType(currentItemType, itemsForCurrentType);

      console.log('previous items are', itemsForPreviousType);
      console.log('current items are', itemsForCurrentType);
    } else if (event.previousIndex !== event.currentIndex) {
      // element was moved within section
      const itemsForType = this.getItemsForType(currentItemType);
      moveItemInArray(itemsForType, event.previousIndex, event.currentIndex);
      this.setItemsForType(currentItemType, itemsForType);
      console.log('items are', itemsForType);
    } else {
      // nothing was changed
      return;
    }

    this.updateDropLists();
    this.publishUpdate();
  }

  private getItemsForType(type: GameAbsenceType): GameAbsenceEditorItem[] {
    switch (type) {
      case GameAbsenceType.Injured:
        return [...this.injuredItems()];
      case GameAbsenceType.Suspended:
        return [...this.suspendedItems()];
      case GameAbsenceType.AtRisk:
        return [...this.atRiskItems()];
      case GameAbsenceType.Exempt:
        return [...this.exemptItems()];
      default:
        assertUnreachable(type);
    }
  }

  private setItemsForType(type: GameAbsenceType, items: GameAbsenceEditorItem[]) {
    switch (type) {
      case GameAbsenceType.Injured:
        this.injuredItems.set([...items]);
        break;
      case GameAbsenceType.Suspended:
        this.suspendedItems.set([...items]);
        break;
      case GameAbsenceType.AtRisk:
        this.atRiskItems.set([...items]);
        break;
      case GameAbsenceType.Exempt:
        this.exemptItems.set([...items]);
        break;
      default:
        assertUnreachable(type);
    }
  }

  private updateDropLists() {
    this.dropLists.set([
      { id: GameAbsenceType.Injured, titleI18nKey: 'absence.injured', items: this.injuredItems() },
      { id: GameAbsenceType.Suspended, titleI18nKey: 'absence.suspended', items: this.suspendedItems() },
      { id: GameAbsenceType.AtRisk, titleI18nKey: 'absence.atRisk', items: this.atRiskItems() },
      { id: GameAbsenceType.Exempt, titleI18nKey: 'absence.other', items: this.exemptItems() },
    ]);
  }

  private publishUpdate() {
    this.onUpdate.emit([
      ...this.injuredItems(),
      ...this.suspendedItems(),
      ...this.atRiskItems(),
      ...this.exemptItems(),
    ]);
  }

}
