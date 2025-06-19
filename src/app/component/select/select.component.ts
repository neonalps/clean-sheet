import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, signal, ViewChild } from '@angular/core';
import { OptionId, SelectOption } from './option';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { getHtmlInputElementFromEvent, isDefined, isNotDefined } from '@src/app/util/common';
import { ClickOutsideDirective } from '@src/app/directive/click-outside/click-outside.directive';
import { ChevronDownComponent } from '@src/app/icon/chevron-down/chevron-down.component';
import { COLOR_LIGHT } from '@src/styles/constants';
import { PlayerIconComponent } from "@src/app/component/player-icon/player-icon.component";
import { LoadingComponent } from "@src/app/component/loading/loading.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { CheckComponent } from '@src/app/icon/check/check.component';

@Component({
  selector: 'app-select',
  imports: [ChevronDownComponent, CheckComponent, CommonModule, ClickOutsideDirective, LoadingComponent, PlayerIconComponent, LoadingComponent, SearchComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css'
})
export class SelectComponent implements OnInit, OnDestroy {

  colorLight = COLOR_LIGHT;
  isOpen = signal(false);

  private selected: SelectOption | null = null;

  @ViewChild('search', { static: false }) searchElement!: ElementRef;

  @Input() optionsSource!: Observable<SelectOption[]>;
  @Input() onBefore?: Observable<boolean>;
  @Input() onNext?: Observable<boolean>;
  @Input() emptyText!: string;
  @Input() isLoading = false;
  @Input() showSearch: boolean = false;
  @Input() selectedOptionId?: OptionId;
  @Input() hideChevron = false;
  @Input() showOutline = true;
  @Input() showSelectedTick = true;
  @Input() minWidth: string | null = null;
  @Input() centerOptions: boolean = false;

  @Output() onSearch = new EventEmitter<string>();
  @Output() onSelected = new EventEmitter<OptionId>();
  @Output() onHasNext = new EventEmitter<boolean>();
  @Output() onHasBefore = new EventEmitter<boolean>();

  options: SelectOption[] | null = null;

  displayIcon: string | null = null;
  displayText: string | null = null;

  private subscriptions: Subscription[] = [];

  private selectedIdx: number | null = null;
  private hasBefore = false;
  private hasNext = false;

  ngOnInit(): void {
    this.displayText = this.emptyText;

    this.subscriptions.push(this.optionsSource.subscribe(value => {
      this.options = value;

      // handle preselect state
      if (isDefined(this.selectedOptionId)) {
        const selected = this.options.find(item => item.id === this.selectedOptionId);
        if (selected !== undefined) {
          this.onSelect(selected);
        }
      } 
    }));

    if (this.onBefore) {
      this.subscriptions.push(this.onBefore.subscribe(_ => {
        if (!this.hasBefore) {
          return;
        }

        this.onSelect((this.options as SelectOption[])[(this.selectedIdx as number) + 1]);
      }));
    }

    if (this.onNext) {
      this.subscriptions.push(this.onNext.subscribe(_ => {
        if (!this.hasNext) {
          return;
        }

        this.onSelect((this.options as SelectOption[])[(this.selectedIdx as number) - 1]);
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(item => item.unsubscribe());
  }

  onSearchChange(event: Event): void {
    this.onSearch.next(getHtmlInputElementFromEvent(event).value);
  }

  onSelect(selectedOption: SelectOption): void {
    if (this.selected?.id === selectedOption.id) {
      this.hideDropdown();
      return;
    }

    this.selected = selectedOption;
    this.displayIcon = this.selected.icon ?? null;
    this.displayText = this.selected.name;
    this.onSelected.next(this.selected.id);
    this.hideDropdown();

    if (isDefined(this.selected)) {
      this.selectedIdx = (this.options as SelectOption[]).findIndex(item => item.id === this.selected?.id);
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

    this.isOpen.set(!isOpen);
  }

  isSelected(option: SelectOption): boolean {
    return this.selected?.id === option.id;
  }

  handleOutsideClick() {
    this.hideDropdown();
  }

  focusSearch(): void {
    setTimeout(() => this.searchElement.nativeElement.focus(), 40);
  }

}
