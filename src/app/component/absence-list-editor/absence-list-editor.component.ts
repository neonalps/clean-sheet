import { Component, OnDestroy, OnInit, computed, input, output, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { GameAbsenceEditorItem, AbsenceListEditorItemComponent, EditorPerson } from '@src/app/component/absence-list-editor-item/absence-list-editor-item.component';
import { GameAbsenceType } from '@src/app/model/game';

@Component({
  selector: 'app-absence-list-editor',
  imports: [CommonModule, I18nPipe, AbsenceListEditorItemComponent],
  templateUrl: './absence-list-editor.component.html',
})
export class AbsenceListEditorComponent implements OnInit, OnDestroy {

  readonly absences = input.required<GameAbsenceEditorItem[]>();
  readonly activeSquad = input.required<EditorPerson[]>();

  readonly onUpdate = output<GameAbsenceEditorItem[]>();

  readonly editorItems = signal<GameAbsenceEditorItem[]>([]);

  readonly injuredItems = computed(() => this.editorItems().filter(item => item.absenceType === GameAbsenceType.Injured));
  readonly suspendedItems = computed(() => this.editorItems().filter(item => item.absenceType === GameAbsenceType.Suspended));
  readonly atRiskItems = computed(() => this.editorItems().filter(item => item.absenceType === GameAbsenceType.AtRisk));
  readonly otherItems = computed(() => this.editorItems().filter(item => item.absenceType === GameAbsenceType.Exempt));

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

  removeItem(itemId: string) {
    this.editorItems.update(current => current.filter(item => item.id !== itemId));
    this.publishUpdate();
  }

  private publishUpdate() {
    this.onUpdate.emit([...this.absences()]);
  }

}
