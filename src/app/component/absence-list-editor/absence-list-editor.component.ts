import { Component, OnDestroy, OnInit, computed, input, output, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { GameAbsenceEditorItem, AbsenceListEditorItemComponent, EditorPerson } from '@src/app/component/absence-list-editor-item/absence-list-editor-item.component';
import { GameAbsenceType } from '@src/app/model/game';
import { CdkDragDrop, moveItemInArray, CdkDropList } from '@angular/cdk/drag-drop';
import { groupBy } from '@src/app/util/array';

export type GameAbsenceDropLists = Array<GameAbsenceDropList>;

export type GameAbsenceDropList = {
  id: string;
  items: GameAbsenceEditorItem[];
  titleI18nKey: string;
}

@Component({
  selector: 'app-absence-list-editor',
  imports: [CommonModule, I18nPipe, AbsenceListEditorItemComponent, CdkDropList],
  templateUrl: './absence-list-editor.component.html',
})
export class AbsenceListEditorComponent implements OnInit, OnDestroy {

  readonly absences = input.required<GameAbsenceEditorItem[]>();
  readonly activeSquad = input.required<EditorPerson[]>();

  readonly onUpdate = output<GameAbsenceEditorItem[]>();

  readonly editorItems = signal<GameAbsenceEditorItem[]>([]);

  readonly lists = computed<GameAbsenceDropLists>(() => {
    const mappedItems = groupBy(this.editorItems(), (item: GameAbsenceEditorItem) => item.absenceType);
    return [
      { id: GameAbsenceType.Injured, titleI18nKey: 'absence.injured', items: mappedItems.get(GameAbsenceType.Injured) ?? [] },
      { id: GameAbsenceType.Exempt, titleI18nKey: 'absence.other', items: mappedItems.get(GameAbsenceType.Exempt) ?? [] },
      { id: GameAbsenceType.Suspended, titleI18nKey: 'absence.suspended', items: mappedItems.get(GameAbsenceType.Suspended) ?? [] },
      { id: GameAbsenceType.AtRisk, titleI18nKey: 'absence.atRisk', items: mappedItems.get(GameAbsenceType.AtRisk) ?? [] },
    ];
  });

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.editorItems.set([...this.absences()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addItem() {
    this.editorItems.update(current => {
      return [...current, {
        id: crypto.randomUUID(),
        person: null,
        absenceType: GameAbsenceType.Injured,
        absenceReason: null,
      }];
    });
    this.publishUpdate();
  }

  updateItem(updatedItem: GameAbsenceEditorItem) {
    this.editorItems.update(currentItems => {
      const currentItemIdx = currentItems.findIndex(item => item.id === updatedItem.id);
      currentItems[currentItemIdx] = updatedItem;
      return [...currentItems];
    });
  }

  removeItem(itemId: string) {
    this.editorItems.update(current => current.filter(item => item.id !== itemId));
    this.publishUpdate();
  }

  onItemDrop(event: CdkDragDrop<GameAbsenceEditorItem[]>) {
    console.log('drop event', event)

    const currentListItems = this.editorItems();

    // Same list → reorder
    if (event.previousContainer === event.container) {
      moveItemInArray(currentListItems, event.previousIndex, event.currentIndex);
    } else {
      // element was moved to new section
      console.log('must move to new section');
    }    
    
    this.editorItems.set([...currentListItems]);

    this.publishUpdate();
  }

  private publishUpdate() {
    this.onUpdate.emit([...this.editorItems()]);
  }

}
