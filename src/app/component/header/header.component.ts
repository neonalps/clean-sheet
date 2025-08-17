import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { MenuService } from '@src/app/module/menu/service';
import { COLOR_LIGHT } from '@src/styles/constants';
import { debounceTime, Subject, switchMap, takeUntil } from 'rxjs';
import { NavMenuComponent } from "@src/app/component/nav-menu/nav-menu.component";
import { assertUnreachable, getHtmlInputElementFromEvent } from '@src/app/util/common';
import { ExternalSearchService } from '@src/app/module/external-search/service';
import { ExternalSearchEntity, ExternalSearchResultItemDto } from '@src/app/model/external-search';
import { UiIconDescriptor, UiIconType } from '@src/app/model/icon';
import { navigateToClub, navigateToGameWithoutDetails, navigateToPerson, navigateToSeasonGames } from '@src/app/util/router';
import { Router } from '@angular/router';
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";
import { StopEventPropagationDirective } from '@src/app/directive/stop-event-propagation/stop-event-propagation.directive';

@Component({
  selector: 'app-header',
  imports: [CommonModule, UiIconComponent, SearchComponent, NavMenuComponent, UiIconComponent, ClickOutsideDirective, StopEventPropagationDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('search', { static: false }) searchElement!: ElementRef;

  colorLight = COLOR_LIGHT;
  readonly isMenuOpen = signal(false);
  readonly isAccountMenuOpen = signal(false);
  readonly isSearchCloseVisible = signal(false);
  readonly isSearchFocused = signal(false);
  readonly isSearchResultOpen = signal(false);

  readonly searchResultItems$ = new Subject<ExternalSearchResultItemDto[]>();

  private readonly externalSearchService = inject(ExternalSearchService);
  private readonly menuService = inject(MenuService);
  private readonly router = inject(Router);

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
        this.isSearchResultOpen.set(true);
        this.isSearchCloseVisible.set(true);

        return this.externalSearchService.search(searchValue);
      }),
    ).subscribe({
      next: searchResult => {
        console.log('search', searchResult);

        this.searchResultItems$.next(searchResult.items);
      },
      error: error => {
        console.error('search error', error);
        this.isSearchResultOpen.set(false);
      },
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.searchElement.nativeElement.onblur = () => {
      if (!this.isSearchResultOpen()) {
        this.isSearchFocused.set(false);
      }
    }
  }

  closeSearch() {
    this.isSearchFocused.set(false);
    this.isSearchResultOpen.set(false);
    this.isSearchCloseVisible.set(false);

    setTimeout(() => {
      this.searchElement.nativeElement.blur();
      this.resetSearch();
    }, 0);
  }

  hideAccountMenuIfOpen() {
    if (this.isAccountMenuOpen()) {
      this.isAccountMenuOpen.set(false);
    }
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

  toggleAccountMenu() {
    this.isAccountMenuOpen.set(!this.isAccountMenuOpen());
  }

  getIconDescriptor(resultItem: ExternalSearchResultItemDto): UiIconDescriptor {
    return {
      type: this.convertResultItemTypeToIconType(resultItem.type),
      content: resultItem.icon!,
    }
  }

  resultItemClicked(resultItem: ExternalSearchResultItemDto) {
    switch (resultItem.type) {
      case ExternalSearchEntity.Person:
        navigateToPerson(this.router, resultItem.entityId);
        break;
      case ExternalSearchEntity.Club:
        navigateToClub(this.router, resultItem.entityId);
        break;
      case ExternalSearchEntity.Competition:
        throw new Error(`Competition not handled`);
      case ExternalSearchEntity.Game:
        navigateToGameWithoutDetails(this.router, resultItem.entityId);
        break;
      case ExternalSearchEntity.Season:
        navigateToSeasonGames(this.router, resultItem.entityId);
        break;
      case ExternalSearchEntity.Venue:
        throw new Error(`Venue not handled`);
      default:
        assertUnreachable(resultItem.type);
    }

    this.closeSearch();
  }

  private convertResultItemTypeToIconType(entity: ExternalSearchEntity): UiIconType {
    switch (entity) {
      case ExternalSearchEntity.Person:
        return 'player';
      case ExternalSearchEntity.Club:
        return 'club';
      case ExternalSearchEntity.Competition:
        return 'competition';
      case ExternalSearchEntity.Game:
        throw new Error(`Game not handled`);
      case ExternalSearchEntity.Season:
        throw new Error(`Season not handled`);
      case ExternalSearchEntity.Venue:
        throw new Error(`Venue not handled`);
      default:
        assertUnreachable(entity);
    }
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
