import { Component, computed, ElementRef, HostListener, input, OnDestroy, OnInit, output, signal, viewChild } from "@angular/core";
import { debounceTime, map, Subject, takeUntil } from "rxjs";
import { OptionId, SelectOption } from "@src/app/component/select/option";
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";
import { CommonModule } from "@angular/common";
import { SelectOptionComponent } from "@src/app/component/select-option/select-option.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { SearchComponent } from "@src/app/icon/search/search.component";
import { getHtmlInputElementFromEvent } from "@src/app/util/common";

@Component({
  selector: 'app-multi-select',
  imports: [CommonModule, ClickOutsideDirective, SelectOptionComponent, UiIconComponent, SearchComponent],
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

    readonly onSelectedChange = output<OptionId[]>();

    readonly isOpen = signal(false);
    readonly optionsWidth = signal('0');

    readonly visibleOptions = computed(() => {
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

    private readonly currentSearchValue = signal<string>('');

    private readonly destroy$ = new Subject<void>();
    private readonly searchValues$ = new Subject<string>();

    ngOnInit(): void {
        this.searchValues$.pipe(
            map(searchValue => searchValue.trim()),
            takeUntil(this.destroy$),
        ).subscribe({
            next: newSearchValue => this.currentSearchValue.set(newSearchValue),
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

    toggleOption(optionId: OptionId) {
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
        this.onSelectedChange.emit(updatedSelected);
    }

}