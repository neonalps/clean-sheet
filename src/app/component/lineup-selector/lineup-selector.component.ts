import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { BehaviorSubject, debounceTime, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { ExternalSearchEntity } from '@src/app/model/external-search';
import { convertExternalSearchItemToSelectOption } from '@src/app/module/external-search/util';
import { LineupItem, LineupSelectorPersonItemComponent } from '@src/app/component/lineup-selector-person-item/lineup-selector-person-item.component';
import { PersonId } from '@src/app/util/domain-types';
import { ensureNotNullish, getHtmlInputElementFromEvent } from '@src/app/util/common';
import { SelectOption } from '@src/app/component/select/option';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { ShirtModalPayload } from '@src/app/component/modal-select-shirt/modal-select-shirt.component';
import { ModalService } from '@src/app/module/modal/service';

@Component({
  selector: 'app-lineup-selector',
  imports: [CommonModule, LineupSelectorPersonItemComponent, LoadingComponent],
  templateUrl: './lineup-selector.component.html',
  styleUrl: './lineup-selector.component.css'
})
export class LineupSelectorComponent implements OnInit, OnDestroy {

  @ViewChild('searchPerson', { static: false }) searchElement!: ElementRef;

  readonly currentSearchValue = signal<string | null>(null);
  readonly isAdding = signal(false);
  readonly isSearchingForPerson = signal(false);
  readonly addPersonOptions = signal<SelectOption[] | null>(null);

  readonly lineupItems$ = new BehaviorSubject<LineupItem[]>([]);

  private readonly lineupItems: LineupItem[] = [
    { shirt: 1, person: { personId: 2211, firstName: 'Oliver', lastName: 'Christensen', avatar: 'http://localhost:8020/p/2211.png' } },
    { shirt: 2, person: { personId: 2265, firstName: 'Jeyland', lastName: 'Mitchell', avatar: 'http://localhost:8020/p/2265.png' } },
  ];

  private readonly destroy$ = new Subject<void>();
  private readonly personSearch$ = new Subject<string>();

  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly modalService = inject(ModalService);

  ngOnInit(): void {
    this.lineupItems$.next(this.lineupItems);

    this.personSearch$.pipe(
      debounceTime(250),
      switchMap(value => {
        if (value.trim().length === 0) {
          return of([]);
        }

        this.currentSearchValue.set(value);
        this.isSearchingForPerson.set(true);
        return this.externalSearchService.search(value, [ExternalSearchEntity.Person]);
      }),
      map(response => {
        console.log('raw response', response);
        this.isSearchingForPerson.set(false);
        if ('items' in response) {
          return response.items.map(item => convertExternalSearchItemToSelectOption(item));
        }

        return response;
      }),
      takeUntil(this.destroy$),
    ).subscribe(responseItems => {
      console.log(`converted response`, responseItems);

      this.addPersonOptions.set(responseItems);
      this.isSearchingForPerson.set(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  triggerAddPerson() {
    this.isAdding.set(true);
    this.focusSearch();
  }

  triggerCancelAddPerson() {
    this.resetAdd();
  }

  focusSearch(): void {
    setTimeout(() => this.searchElement.nativeElement.focus());
  }

  onLineupPersonRemoved(personId: PersonId) {
    const idxToRemove = this.lineupItems.findIndex(item => item.person.personId === personId);
    if (idxToRemove >= 0) {
      this.lineupItems.splice(idxToRemove, 1);
      this.lineupItems$.next(this.lineupItems);
    }
  }

  onPersonSelected(option: SelectOption) {
    this.lineupItems.push({
      shirt: 0,
      person: {
        personId: Number(option.id),
        firstName: option.name,
        lastName: '',
        avatar: option.icon?.content,
      }
    });

    this.resetAdd();
  }

  personShirtClicked(personId: PersonId) {
    const lineupItem = this.lineupItems.find(item => item.person.personId === personId);
    if (!lineupItem) {
      return;
    }

    this.modalService.showShirtModal({ personId: lineupItem.person.personId, shirt: lineupItem.shirt, unavailable: this.collectShirts() })
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: event => {
          if (event.type === 'confirm') {
            this.onPersonShirtSelected(event.value as ShirtModalPayload);
          }
        }
    });
  }

  onPersonShirtSelected(payload: ShirtModalPayload) {
    const lineupItem = this.lineupItems.find(item => item.person.personId === payload.personId);
    if (!lineupItem || lineupItem.shirt === payload.shirt) {
      return;
    }

    lineupItem.shirt = payload.shirt;

    this.lineupItems$.next(this.lineupItems);
  }

  onAddNewPerson() {
    this.modalService.showConfirmAddPersonModal({ personName: ensureNotNullish(this.currentSearchValue()) })
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: event => {
          if (event.type === 'confirm') {
            console.log('create the new person now!');
          }
        }
    });
  }

  onSearchInput(event: Event) {
    const searchValue = getHtmlInputElementFromEvent(event).value;
    this.personSearch$.next(searchValue);
  }

  private resetAdd() {
    this.isAdding.set(false);
    this.addPersonOptions.set(null);
    this.currentSearchValue.set(null);
  }

  private collectShirts(): Set<number> {
    return new Set(this.lineupItems.map(item => item.shirt));
  }

}
