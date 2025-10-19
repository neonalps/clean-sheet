import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
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
import { getPersonName } from '@src/app/util/domain';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { EmptyStateComponent } from "@src/app/component/empty-state/empty-state.component";
import { FieldWithBallComponent } from "@src/app/icon/field-with-ball/field-with-ball.component";
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { PersonService } from '@src/app/module/person/service';
import { ToastService } from '@src/app/module/toast/service';

@Component({
  selector: 'app-lineup-selector',
  imports: [CommonModule, LineupSelectorPersonItemComponent, LoadingComponent, I18nPipe, UiIconComponent, CdkDropList, EmptyStateComponent, FieldWithBallComponent],
  templateUrl: './lineup-selector.component.html',
  styleUrl: './lineup-selector.component.css'
})
export class LineupSelectorComponent implements OnInit, OnDestroy {

  @Input() titleText!: string;
  
  @Input() forMain: boolean | undefined;
  @Input() hasCaptain = true;
  @Input() hasShirt = true;
  @Input() maximumPeople: number | undefined;

  @ViewChild('searchPerson', { static: false }) searchElement!: ElementRef;
  @ViewChild('startingSection', { static: false }) startingSection!: ElementRef;

  readonly currentSearchValue = signal<string | null>(null);
  readonly isAdding = signal(false);
  readonly isSearchingForPerson = signal(false);
  readonly addPersonOptions = signal<SelectOption[] | null>(null);

  readonly lineupItems$ = new BehaviorSubject<LineupItem[]>([]);

  private readonly lineupItems: LineupItem[] = [];

  private readonly destroy$ = new Subject<void>();
  private readonly personSearch$ = new Subject<string>();

  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly modalService = inject(ModalService);
  private readonly personService = inject(PersonService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);

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
    const selectedPersonId = Number(option.id);

    this.lineupItems.push({
      shirt: 0,
      person: {
        personId: selectedPersonId,
        firstName: option.name,
        lastName: '',
        avatar: option.icon?.content,
      },
      forMain: this.forMain ?? undefined,
    });

    this.resetAdd();

    if (this.hasShirt) {
      this.personShirtClicked(selectedPersonId);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
     moveItemInArray(this.lineupItems, event.previousIndex, event.currentIndex);
     this.lineupItems$.next(this.lineupItems);
  }

  personShirtClicked(personId: PersonId) {
    if (!this.hasShirt) {
      return;
    }

    const lineupItem = this.lineupItems.find(item => item.person.personId === personId);
    if (!lineupItem) {
      return;
    }

    this.modalService.showShirtModal({ personId: lineupItem.person.personId, personName: getPersonName(lineupItem.person), avatar: lineupItem.person.avatar, shirt: lineupItem.shirt, unavailable: this.collectShirts() })
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: event => {
          if (event.type === 'confirm') {
            this.onPersonShirtSelected(event.value as ShirtModalPayload);
          }
        }
    });
  }

  onPersonShirtSelected(payload: ShirtModalPayload) {
    if (!this.hasShirt) {
      return;
    }

    const lineupItem = this.lineupItems.find(item => item.person.personId === payload.personId);
    if (!lineupItem || lineupItem.shirt === payload.shirt) {
      return;
    }

    lineupItem.shirt = payload.shirt;

    this.lineupItems$.next(this.lineupItems);
  }

  onPersonSetCaptain(personId: PersonId) {
    if (!this.hasCaptain) {
      return;
    }

    const lineupItem = this.lineupItems.find(item => item.person.personId === personId);
    if (!lineupItem || lineupItem.isCaptain === true) {
      return;
    }

    this.lineupItems
      .filter(item => item.isCaptain === true)
      .forEach(item => {
        item.isCaptain = false
      });

    lineupItem.isCaptain = true;

    this.lineupItems$.next(this.lineupItems);
  }

  onAddNewPerson() {
    const personName = ensureNotNullish(this.currentSearchValue());
    this.modalService.showConfirmAddPersonModal({ personName: this.translationService.translate('person.create.detail', { name: personName }) })
      .pipe(takeUntil(this.destroy$)).subscribe({
        next: event => {
          if (event.type === 'confirm') {
            const personNameParts = personName
              .split(' ')
              .map(part => part.trim());

            const personNamePartLength = personNameParts.length;

            this.personService.create({ 
              lastName: personNameParts[personNamePartLength - 1],
              firstName: personNamePartLength > 1 ? personNameParts.slice(0, personNamePartLength - 1).join(' ') : undefined,
             }).pipe(takeUntil(this.destroy$)).subscribe({
              next: createdPerson => {
                this.onPersonSelected({ id: createdPerson.id, name: getPersonName(createdPerson) });
              },
              error: err => {
                console.error(`Failed to create person`, err);
                this.toastService.addToast({ type: 'error', text: this.translationService.translate('person.create.error') });
              }
             })
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
