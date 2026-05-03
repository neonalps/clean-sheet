import { Component, OnDestroy, OnInit, input, signal } from '@angular/core';
import { GameAbsence } from '@src/app/model/game';
import { SmallPerson } from '@src/app/model/person';
import { Subject } from 'rxjs';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { CommonModule } from '@angular/common';
import { GameAbsenceEditorItem } from '@src/app/component/absence-list-editor-item/absence-list-editor-item.component';

@Component({
  selector: 'app-absence-list-editor',
  imports: [CommonModule, I18nPipe],
  templateUrl: './absence-list-editor.component.html',
})
export class AbsenceListEditorComponent implements OnInit, OnDestroy {

  readonly absences = input.required<GameAbsence[]>();
  readonly activeSquad = input.required<SmallPerson[]>();

  readonly editorItems = signal<GameAbsenceEditorItem[]>([]);
  

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
