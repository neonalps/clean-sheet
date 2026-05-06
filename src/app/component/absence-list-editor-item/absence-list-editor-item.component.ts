import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { GameAbsenceType } from '@src/app/model/game';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { SelectComponent } from "@src/app/component/select/select.component";
import { combineLatest, isEmpty, map, Observable, of, startWith, Subject } from 'rxjs';
import { SelectOption } from '@src/app/component/select/option';
import { PersonId } from '@src/app/util/domain-types';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { isDefined } from '@src/app/util/common';
import { CommonModule } from '@angular/common';
import { TranslationService } from '@src/app/module/i18n/translation.service';

export type EditorPerson = { 
  id: PersonId; 
  displayName: string; 
  avatar?: string
}

export type GameAbsenceEditorItem = {
  id: string;
  person: EditorPerson | null;
  absenceType: GameAbsenceType;
  absenceReason: string | null;
}

@Component({
  selector: 'app-absence-list-editor-item',
  imports: [CommonModule, UiIconComponent, SelectComponent, I18nPipe],
  templateUrl: './absence-list-editor-item.component.html',
})
export class AbsenceListEditorItemComponent implements OnInit {

  readonly absence = input.required<GameAbsenceEditorItem>();
  readonly availablePersons = input.required<EditorPerson[]>();

  readonly onUpdate = output<GameAbsenceEditorItem>();
  readonly onRemove = output<string>();

  readonly pushPerson$ = new Subject<SelectOption>();
  readonly pushType$ = new Subject<SelectOption>();
  readonly pushReason$ = new Subject<SelectOption>();

  readonly personOptions = computed<SelectOption[]>(() => {
    return this.availablePersons().map(person => ({ 
      id: person.id, 
      icon: person.avatar ? { type: 'person', content: person.avatar } : undefined,
      name: person.displayName,
     }));
  });

  readonly personSelected = computed(() => {
    return isDefined(this.absence().person);
  });

  readonly typeSelected = computed(() => {
    return isDefined(this.absence().absenceType);
  });

  private readonly personSearchValue = new Subject<string>();
  private readonly reasonSearchValue = new Subject<string>();

  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    setTimeout(() => {
      const person = this.absence().person;
      if (isDefined(person)) {
        this.pushPerson$.next({
          id: person.id.toString(),
          name: person.displayName,
        });
      }

      const absenceType = this.absence().absenceType;
      if (isDefined(absenceType)) {
        this.pushType$.next({
          id: absenceType,
          name: this.translationService.translate(`gameAbsenceType.${absenceType}`),
        });
      }
    });
  }

  getPersonOptions(): Observable<SelectOption[]> {
    return combineLatest([
      of(this.personOptions()),
      this.personSearchValue.asObservable().pipe(startWith('')),
    ]).pipe(
      map(([persons, search]) => {
        if (search.trim().length === 0) {
          return persons;
        }

        return persons.filter(item => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
      }),
    );
  }

  getTypeOptions(): Observable<SelectOption[]> {
    return of([
      {
        id: 'injured',
        name: this.translationService.translate(`gameAbsenceType.injured`),
      },
      {
        id: 'suspended',
        name: this.translationService.translate(`gameAbsenceType.suspended`),
      },
      {
        id: 'atRisk',
        name: this.translationService.translate(`gameAbsenceType.atRisk`),
      },
      {
        id: 'exempt',
        name: this.translationService.translate(`gameAbsenceType.exempt`),
      },
    ]);
  }

  getReasonOptions(): Observable<SelectOption[]> {
    return of([]);
  }

  onReasonSearchChange(searchValue: string) {
    this.reasonSearchValue.next(searchValue);
  }

  onPersonSearchChange(searchValue: string) {
    this.personSearchValue.next(searchValue);
  }

  onPersonSelected(selected: SelectOption) {
    this.onUpdate.emit({
      ...this.absence(),
      person: {
        id: typeof selected.id === 'number' ? selected.id : Number(selected.id),
        displayName: selected.name,
        avatar: selected.icon?.content ?? undefined,
      }
    })
  }

  removeClicked() {
    this.onRemove.emit(this.absence().id);
  }

}
