import { Component, inject } from '@angular/core';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { SelectComponent } from "@src/app/component/select/select.component";
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { debounceTime, map, merge, Observable, of, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-game-create',
  imports: [I18nPipe, SelectComponent],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css'
})
export class GameCreateComponent {

  isSearchingForClub = false;

  private readonly clubSearch$ = new Subject<string>();

  private readonly externalSearchService = inject(ExternalSearchService);

  onSearchChanged(value: string) {
    this.clubSearch$.next(value);
  }

  onClubSelected(id: OptionId) {
    console.log('club selected', id);
  }

  getClubOptions(): Observable<SelectOption[]> {
    return merge(this.getDefaultClubOptions(), this.searchForClub());
  }

  private searchForClub(): Observable<SelectOption[]> {
      return this.clubSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultClubOptions();  
          }
  
          this.isSearchingForClub = true;
          return this.externalSearchService.search(value, [ExternalSearchEntity.Club]);
        }),
        map(response => {
          if ('items' in response) {
            return response.items.map(item => convertExternalSearchItemToSelectOption(item));
          }
  
          return response;
        }),
      );
    }
  
    private getDefaultClubOptions(): Observable<SelectOption[]> {
      return of([]);
    }

}
