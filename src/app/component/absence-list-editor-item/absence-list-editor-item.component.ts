import { Component, computed, input, output, Signal } from '@angular/core';
import { GameAbsenceType } from '@src/app/model/game';
import { UiIconComponent } from '@src/app/component/ui-icon/icon.component';
import { SelectComponent } from "@src/app/component/select/select.component";
import { combineLatest, map, merge, Observable, of, startWith, Subject } from 'rxjs';
import { SelectOption } from '@src/app/component/select/option';
import { PersonId } from '@src/app/util/domain-types';

export type EditorPerson = { 
  id: PersonId; 
  displayName: string; 
  avatar?: string
}

export type GameAbsenceEditorItem = {
  id: string;
  person: EditorPerson | null;
  absenceType: GameAbsenceType;
  absenceReason: string;
}

@Component({
  selector: 'app-absence-list-editor-item',
  imports: [UiIconComponent, SelectComponent],
  templateUrl: './absence-list-editor-item.component.html',
})
export class AbsenceListEditorItemComponent {

  readonly absence = input.required<GameAbsenceEditorItem>();
  readonly availablePersons = input.required<EditorPerson[]>();

  readonly onUpdate = output<GameAbsenceEditorItem>();
  readonly onRemove = output<string>();

  readonly pushPerson$ = new Subject<SelectOption>();

  readonly personOptions: Signal<SelectOption[]> = computed(() => {
    return this.availablePersons().map(person => ({ 
      id: person.id, 
      icon: person.avatar ? { type: 'person', content: person.avatar } : undefined,
      name: person.displayName,
     }));
  });

  private readonly personSearchValue = new Subject<string>();

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
