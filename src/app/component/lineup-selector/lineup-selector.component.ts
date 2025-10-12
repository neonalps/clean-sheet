import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { debounceTime, map, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';

@Component({
  selector: 'app-lineup-selector',
  imports: [CommonModule, SelectComponent],
  templateUrl: './lineup-selector.component.html',
  styleUrl: './lineup-selector.component.css'
})
export class LineupSelectorComponent {

  readonly isSearchingForPerson = signal(false);

  private readonly personSearch$ = new Subject<string>();

  private readonly selectedPersonId$ = new Subject<number>();

  private readonly externalSearchService = inject(ExternalSearchService);

  getAddPersonOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultAddPersonOptions(), this.searchForPerson());
  }

  onAddPersonSearchChanged(value: string) {
    this.personSearch$.next(value);
  }

  onAddPersonSelected(id: OptionId) {
    this.selectedPersonId$.next(Number(id));
  }

  private searchForPerson(): Observable<SelectOption[]> {
    return this.personSearch$.pipe(
      debounceTime(250),
      switchMap(value => {
        if (value.trim().length === 0) {
          return this.getDefaultAddPersonOptions();  
        }

        this.isSearchingForPerson.set(true);
        return this.externalSearchService.search(value, [ExternalSearchEntity.Person]);
      }),
      map(response => {
        console.log('search', response)
        this.isSearchingForPerson.set(false);
        if ('items' in response) {
          return response.items.map(item => convertExternalSearchItemToSelectOption(item));
        }

        return response;
      }),
    );
  }

  private getDefaultAddPersonOptions(): Observable<SelectOption[]> {
    return of([]);
  }

}
