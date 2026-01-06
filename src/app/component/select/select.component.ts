import { Component, ElementRef, EventEmitter, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { OptionId, SelectOption } from './option';
import { CommonModule } from '@angular/common';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { getHtmlInputElementFromEvent, isDefined, isNotDefined } from '@src/app/util/common';
import { ClickOutsideDirective } from '@src/app/directive/click-outside/click-outside.directive';
import { ChevronDownComponent } from '@src/app/icon/chevron-down/chevron-down.component';
import { COLOR_LIGHT } from '@src/styles/constants';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { CheckComponent } from '@src/app/icon/check/check.component';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { UiIconDescriptor } from '@src/app/model/icon';

export type LoadingStyle = 'skeleton' | 'spinner';

@Component({
  selector: 'app-select',
  imports: [ChevronDownComponent, CheckComponent, CommonModule, ClickOutsideDirective, LoadingComponent, LoadingComponent, SearchComponent, UiIconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit {

  colorLight = COLOR_LIGHT;
  isOpen = signal(false);
  optionsWidth = signal('0');

  private currentValue: SelectOption | null = null;

  @ViewChild('main', { static: false }) mainElement!: ElementRef;
  @ViewChild('search', { static: false }) searchElement!: ElementRef;

  @Input() optionsSource!: Observable<SelectOption[]>;
  @Input() onBefore?: Observable<boolean>;
  @Input() onNext?: Observable<boolean>;
  @Input() emptyText!: string;
  @Input() isLoading = false;
  @Input() showSearch: boolean = false;
  @Input() selectedOption?: Observable<SelectOption | null>;
  @Input() hideChevron = false;
  @Input() showOutline = true;
  @Input() showSelectedTick = true;
  @Input() minWidth: string | null = null;
  @Input() centerOptions: boolean = false;
  @Input() loadingStyle: LoadingStyle = 'spinner';
  @Input() skeletonRowCount: number = 3;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelected = new EventEmitter<SelectOption>();
  @Output() onHasNext = new EventEmitter<boolean>();
  @Output() onHasBefore = new EventEmitter<boolean>();

  options: SelectOption[] | null = null;

  displayIcon: UiIconDescriptor | null = null;
  displayText: string | null = null;

  emptyOptionsVisible = false;

  skeletonRows = [...Array(this.skeletonRowCount).keys()];

  private readonly destroy$ = new Subject<void>();

  private selectedIdx: number | null = null;
  private hasBefore = false;
  private hasNext = false;
  private currentSearchValue = "";

  ngOnInit(): void {
    this.displayText = this.emptyText;

    this.optionsSource.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.options = value;

      this.emptyOptionsVisible = this.currentSearchValue.trim().length > 0 && this.options.length === 0;
    });

    this.selectedOption?.pipe(takeUntil(this.destroy$), filter(value => value !== null)).subscribe(value => {
      this.onSelect(value);
    })

    this.onBefore?.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      if (!this.hasBefore) {
        return;
      }

      this.onSelect((this.options as SelectOption[])[(this.selectedIdx as number) + 1]);
    });

    this.onNext?.pipe(takeUntil(this.destroy$)).subscribe(_ => {
      if (!this.hasNext) {
          return;
        }

        this.onSelect((this.options as SelectOption[])[(this.selectedIdx as number) - 1]);
    });
  }

  onSearchChange(event: Event): void {
    const searchValue = getHtmlInputElementFromEvent(event).value;
    this.currentSearchValue = searchValue;
    this.onSearch.next(searchValue);
  }

  onSelect(selectedOption: SelectOption): void {
    if (this.currentValue?.id === selectedOption.id) {
      this.hideDropdown();
      return;
    }

    this.currentValue = selectedOption;
    this.displayIcon = this.currentValue.icon ?? null;
    this.displayText = this.currentValue.name;
    this.onSelected.next(this.currentValue);
    this.hideDropdown();

    if (isDefined(this.currentValue)) {
      this.selectedIdx = (this.options as SelectOption[]).findIndex(item => item.id === this.currentValue?.id);
      if (isNotDefined(this.selectedIdx)) {
        this.hasBefore = false;
        this.hasNext = false;
        this.onHasBefore.next(false);
        this.onHasNext.next(false);
        return;
      }
      
      this.hasBefore = this.selectedIdx < ((this.options as SelectOption[]).length - 1);
      this.hasNext = this.selectedIdx > 0;
      this.onHasBefore.next(this.hasBefore);
      this.onHasNext.next(this.hasNext);
    }
  }

  getDynamicStyles() {
    const dynamicStyles: Record<string, string | number> = {};

    if (isDefined(this.minWidth)) {
      dynamicStyles['min-width'] = this.minWidth;
    }

    return dynamicStyles;
  }

  getDynamicOptionStyles() {
    const dynamicStyles: Record<string, string | number> = {};

    // use the parent's min width as the options width
    if (isDefined(this.minWidth)) {
      dynamicStyles['width'] = this.minWidth;
    }

    return dynamicStyles;
  }

  hideDropdown() {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }

  toggleDropdown() {
    const isOpen = this.isOpen();

    if (!isOpen && this.showSearch) {
      this.focusSearch();
    }

    if (!isOpen) {
      const mainElementWidth = this.mainElement.nativeElement.getBoundingClientRect().width;
      this.optionsWidth.set(`${mainElementWidth}px`);
    }

    this.isOpen.set(!isOpen);
  }

  isSelected(option: SelectOption): boolean {
    return this.currentValue?.id === option.id;
  }

  handleOutsideClick() {
    this.hideDropdown();
  }

  focusSearch(): void {
    setTimeout(() => this.searchElement.nativeElement.focus(), 40);
  }

}
