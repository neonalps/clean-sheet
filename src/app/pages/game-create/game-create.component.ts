import { Component, inject } from '@angular/core';
import { OptionId, SelectOption } from '@src/app/component/select/option';
import { SelectComponent } from "@src/app/component/select/select.component";
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { debounceTime, map, merge, Observable, of, Subject, switchMap } from 'rxjs';
import { DatetimePickerComponent } from "@src/app/component/datetime-picker/datetime-picker.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';

@Component({
  selector: 'app-game-create',
  imports: [I18nPipe, SelectComponent, DatetimePickerComponent],
  templateUrl: './game-create.component.html',
  styleUrl: './game-create.component.css'
})
export class GameCreateComponent {

  isSearchingForClub = false;
  isSearchingForVenue = false;

  private readonly clubSearch$ = new Subject<string>();
  private readonly venueSearch$ = new Subject<string>();

  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly translationService = inject(TranslationService);

  onClubSearchChanged(value: string) {
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

    getVenueOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultVenueOptions(), this.searchForVenue());
    }

    onVenueSearchChanged(value: string) {
      this.venueSearch$.next(value);
    }

    onVenueSelected(id: OptionId) {
      console.log('venue selected', id);
    }

    private searchForVenue(): Observable<SelectOption[]> {
      return this.venueSearch$.pipe(
        debounceTime(250),
        switchMap(value => {
          if (value.trim().length === 0) {
            return this.getDefaultVenueOptions();  
          }
  
          this.isSearchingForVenue = true;
          return this.externalSearchService.search(value, [ExternalSearchEntity.Venue]);
        }),
        map(response => {
          if ('items' in response) {
            return response.items.map(item => convertExternalSearchItemToSelectOption(item));
          }
  
          return response;
        }),
      );
    }

    private getDefaultVenueOptions(): Observable<SelectOption[]> {
      return of([]);
    }

    getGameStatusOptions(): Observable<SelectOption[]> {
      return merge(this.getDefaultGameStatusOptions());
    }

    onGameStatusSelected(id: OptionId) {
      console.log('game status selected', id);
    }

    private getDefaultGameStatusOptions(): Observable<SelectOption[]> {
      return of([
        { id: 'Scheduled', name: this.translationService.translate(`gameStatus.scheduled`) },
        { id: 'Finished', name: this.translationService.translate(`gameStatus.finished`) },
        { id: 'Ongoing', name: this.translationService.translate(`gameStatus.ongoing`) },
        { id: 'Abandoned', name: this.translationService.translate(`gameStatus.abandoned`) },
        { id: 'Postponed', name: this.translationService.translate(`gameStatus.postponed`) },
      ]);
    }

}
