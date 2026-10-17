import { Component, computed, ElementRef, HostListener, input, OnDestroy, OnInit, output, signal, ViewChild } from '@angular/core';
import { SelectOption } from './option';
import { CommonModule } from '@angular/common';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { getHtmlInputElementFromEvent, isDefined } from '@src/app/util/common';
import { ClickOutsideDirective } from '@src/app/directive/click-outside/click-outside.directive';
import { ChevronDownComponent } from '@src/app/icon/chevron-down/chevron-down.component';
import { COLOR_LIGHT } from '@src/styles/constants';
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { UiIconDescriptor } from '@src/app/model/icon';

export type LoadingStyle = 'skeleton' | 'spinner';

@Component({
  selector: 'app-select',
  imports: [ChevronDownComponent, CommonModule, ClickOutsideDirective, LoadingComponent, LoadingComponent, SearchComponent, UiIconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit, OnDestroy {

  readonly colorLight = COLOR_LIGHT;
  readonly isOpen = signal(false);
  readonly optionsWidth = signal('0');

  private readonly currentValue = signal<SelectOption | null>(null);

  @ViewChild('main', { static: false }) mainElement!: ElementRef;
  @ViewChild('search', { static: false }) searchElement!: ElementRef;

  readonly optionsSource = input.required<Observable<SelectOption[]>>();
  readonly emptyText = input<string>('');
  readonly isLoading = input(false);
  readonly showSearch = input(false);
  readonly selectedOption = input<Observable<SelectOption | null>>();
  readonly hideChevron = input(false);
  readonly showOutline = input(true);
  readonly showSelectedTick = input(true);
  readonly minWidth = input<string | null>(null);
  readonly centerOptions = input(false);
  readonly loadingStyle = input<LoadingStyle>('spinner');
  readonly skeletonRowCount = input(3);

  readonly onSearch = output<string>();
  readonly onSelected = output<SelectOption>();

  readonly options = signal<SelectOption[] | null>(null);

  readonly displayIcon = signal<UiIconDescriptor | null>(null);
  readonly displayText = signal<string | null>(null);

  readonly emptyOptionsVisible = signal(false);

  readonly skeletonRows = computed(() => [...Array(this.skeletonRowCount()).keys()]);

  private readonly destroy$ = new Subject<void>();

  private readonly currentSearchValue = signal('');

  ngOnInit(): void {
    this.displayText.set(this.emptyText());

    this.optionsSource().pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.options.set(value);

      this.emptyOptionsVisible.set(this.currentSearchValue().trim().length > 0 && value.length === 0);
    });

    this.selectedOption()?.pipe(
      filter(value => value !== null), 
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.onSelect(value);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(event: Event): void {
    const searchValue = getHtmlInputElementFromEvent(event).value;
    this.currentSearchValue.set(searchValue);
    this.onSearch.emit(searchValue);
  }

  onSelect(selectedOption: SelectOption): void {
    const currentValue = this.currentValue();
    if (currentValue?.id === selectedOption.id) {
      this.hideDropdown();
      return;
    }

    this.currentValue.set(selectedOption);
    this.displayIcon.set(selectedOption.icon ?? null);
    this.displayText.set(selectedOption.name);
    this.onSelected.emit(selectedOption);
    this.hideDropdown();
  }

  getDynamicStyles() {
    const dynamicStyles: Record<string, string | number> = {};

    const minWidth = this.minWidth();
    if (isDefined(minWidth)) {
      dynamicStyles['min-width'] = minWidth;
    }

    return dynamicStyles;
  }

  getDynamicOptionStyles() {
    const dynamicStyles: Record<string, string | number> = {};

    const minWidth = this.minWidth();
    // use the parent's min width as the options width
    if (isDefined(minWidth)) {
      dynamicStyles['width'] = minWidth;
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

    if (!isOpen && this.showSearch()) {
      this.focusSearch();
    }

    if (!isOpen) {
      const mainElementWidth = this.mainElement.nativeElement.getBoundingClientRect().width;
      this.optionsWidth.set(`${mainElementWidth}px`);
    }

    this.isOpen.set(!isOpen);
  }

  isSelected(option: SelectOption): boolean {
    return this.currentValue()?.id === option.id;
  }

  @HostListener('document:keydown.escape')
  handleOutsideClick() {
    this.hideDropdown();
  }

  focusSearch(): void {
    setTimeout(() => this.searchElement.nativeElement.focus(), 40);
  }

}
