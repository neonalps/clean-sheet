import { Component, computed, ElementRef, HostListener, input, OnDestroy, OnInit, output, signal, viewChild } from "@angular/core";
import { debounceTime, identity, map, Subject, takeUntil } from "rxjs";
import { OptionId, SelectOption } from "@src/app/component/select/option";
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";
import { CommonModule } from "@angular/common";
import { SelectOptionComponent } from "@src/app/component/select-option/select-option.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { SearchComponent } from "@src/app/icon/search/search.component";
import { getHtmlInputElementFromEvent } from "@src/app/util/common";
import { LoadingComponent } from "@src/app/component/loading/loading.component";

export type LoadingStyle = 'skeleton' | 'spinner';

@Component({
  selector: 'app-multi-select',
  imports: [CommonModule, ClickOutsideDirective, SelectOptionComponent, UiIconComponent, SearchComponent, LoadingComponent],
  templateUrl: './select-multi.component.html',
})
export class MultiSelectComponent implements OnInit, OnDestroy {

    readonly mainElement = viewChild.required<ElementRef<HTMLElement>>('main');

    readonly searchElement = viewChild.required<ElementRef<HTMLElement>>('search');

    readonly options = input.required<SelectOption[]>();
    readonly selected = input<OptionId[]>([]);
    readonly hideChevron = input(false);
    readonly showOutline = input(true);
    readonly showSearch = input(false);
    readonly singleMode = input(false);
    readonly asyncSearch = input(false);
    readonly searchDebounceTime = input(0);
    readonly isSearching = input(false);
    readonly loadingStyle = input<LoadingStyle>('spinner');
    readonly skeletonRowCount = input(3);

    readonly onSelectedChange = output<OptionId[]>();
    readonly onSearchValueChange = output<string>();

    readonly isOpen = signal(false);
    readonly optionsWidth = signal('0');

    readonly visibleOptions = computed(() => {
        // if async search is active, we don't have to calculate the visible options ourselves, they will be passed to the component
        if (this.asyncSearch()) {
            return this.options();
        }

        const currentSearch = this.currentSearchValue().toLocaleLowerCase();
        if (currentSearch === '') {
            return this.options();
        }

        return this.options().filter(item => item.name.toLocaleLowerCase().includes(currentSearch));
    });
    
    readonly selectedDisplay = computed(() => {
        const currentlySelected = this.selected();
        
        return this.options()
            .filter(option => currentlySelected.includes(option.id))
            .map(option => option.name)
            .join(', ');
    });

    readonly skeletonRows = computed(() => [...Array(this.skeletonRowCount()).keys()]);

    private readonly currentSearchValue = signal<string>('');

    private readonly destroy$ = new Subject<void>();
    private readonly searchValues$ = new Subject<string>();

    ngOnInit(): void {
        const searchDebounceTimeValue = this.searchDebounceTime();

        this.searchValues$.pipe(
            searchDebounceTimeValue > 0 ? debounceTime(searchDebounceTimeValue) : identity,
            map(searchValue => searchValue.trim()),
            takeUntil(this.destroy$),
        ).subscribe({
            next: newSearchValue => {
                this.currentSearchValue.set(newSearchValue);

                if (this.asyncSearch()) {
                    this.onSearchValueChange.emit(newSearchValue);
                }
            },
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    @HostListener('document:keydown.escape')
    handleOutsideClick() {
        this.hideDropdown();
    }

    hideDropdown() {
        this.isOpen.set(false);
    }

    isOptionCurrentlySelected(optionId: OptionId) {
        return this.selected().includes(optionId);
    }

    onSearchChange(event: Event) {
        const searchValue = getHtmlInputElementFromEvent(event).value;
        this.searchValues$.next(searchValue);
    }

    focusSearch(): void {
        this.searchElement().nativeElement.focus();
    }

    toggleDropdown() {
        this.isOpen.update(currentlyOpen => {
            if (!currentlyOpen) {
                const mainElementWidth = this.mainElement().nativeElement.getBoundingClientRect().width;
                this.optionsWidth.set(`${mainElementWidth}px`);
            }

            return !currentlyOpen;
        });

        setTimeout(() => {
            if (this.isOpen() && this.showSearch()) {
                this.focusSearch();
            }
        }, 40);
    }

    toggleOption(optionId: OptionId): void {
        if (this.singleMode()) {
            this.publishUpdate([optionId]);
            this.hideDropdown();
            return;
        }

        const currentSelected = [...this.selected()];
        const toggledOptionIndex = currentSelected.findIndex(item => item === optionId);
        
        if (toggledOptionIndex === -1) {
            this.publishUpdate([...currentSelected, optionId]);
        } else {
            currentSelected.splice(toggledOptionIndex, 1);
            this.publishUpdate([...currentSelected]);
        }
    }

    private publishUpdate(updatedSelected: OptionId[]) {
        console.log('multi publishing update', updatedSelected);
        this.onSelectedChange.emit(updatedSelected);
    }

}