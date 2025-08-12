import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { SearchComponent } from '@src/app/icon/search/search.component';
import { MenuService } from '@src/app/module/menu/service';
import { COLOR_LIGHT } from '@src/styles/constants';
import { Subject, takeUntil } from 'rxjs';
import { NavMenuComponent } from "@src/app/component/nav-menu/nav-menu.component";

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

  private readonly menuService = inject(MenuService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.menuService.open$
      .pipe(takeUntil(this.destroy$))
      .subscribe(open => {
        this.isMenuOpen.set(open);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNavigation() {
    this.closeMenuIfOpen();
  }

  onSearchIconClicked() {
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

}
