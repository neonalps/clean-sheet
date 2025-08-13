import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { MenuService } from '@src/app/module/menu/service';
import { COLOR_LIGHT } from '@src/styles/constants';
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { NavMenuComponent } from "@src/app/component/nav-menu/nav-menu.component";
import { getHtmlInputElementFromEvent } from '@src/app/util/common';
import { ExternalSearchService } from '@src/app/module/external-search/service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, UiIconComponent, SearchComponent, NavMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  @ViewChild('search', { static: false }) searchElement!: ElementRef;

  colorLight = COLOR_LIGHT;
  readonly isMenuOpen = signal(false);
  readonly isSearchFocused = signal(false);
  readonly isSearchOpen = signal(false);

  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly menuService = inject(MenuService);

  private readonly destroy$ = new Subject<void>();
  private readonly search$ = new Subject<string>();

  ngOnInit(): void {
    this.menuService.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.isMenuOpen.set(open);
      });

    this.search$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      switchMap(searchValue => {
        this.isSearchOpen.set(true);

        return this.externalSearchService.search(searchValue);
      }),
    ).subscribe({
      next: searchResult => {
        console.log('search', searchResult);
      },
      error: error => {
        console.error('search error', error);
        this.isSearchOpen.set(false);
      },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeSearch() {
    this.isSearchFocused.set(false);
    this.isSearchOpen.set(false);
    this.resetSearch();
  }

  onNavigation() {
    this.closeMenuIfOpen();
  }

  onSearchChange(event: Event): void {
    const searchValue = getHtmlInputElementFromEvent(event).value;
    this.search$.next(searchValue);
  }

  onSearchIconClicked() {
    this.isSearchFocused.set(true);
    this.searchElement.nativeElement.focus();
  }

  overlayClick() {
    this.closeMenuIfOpen();
  }

  toggleMenu() {
    this.menuService.toggle();
  }

  private closeMenuIfOpen() {
    if (this.isMenuOpen()) {
      this.menuService.close();
    }
  }

  private resetSearch() {
    this.searchElement.nativeElement.value = '';
  }

}
