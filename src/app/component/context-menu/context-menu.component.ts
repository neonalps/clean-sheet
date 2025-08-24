import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { CommonModule } from '@angular/common';
import { ClickOutsideDirective } from "@src/app/directive/click-outside/click-outside.directive";
import { UiIconDescriptor } from '@src/app/model/icon';
import { Observable, Subject, takeUntil } from 'rxjs';

export type ContextMenuSection = {
  title?: string;
  items: ContextMenuItem[];
}

export type ContextMenuItem = {
  id: string;
  iconDescriptor?: UiIconDescriptor;
  text: string;
}

@Component({
  selector: 'app-context-menu',
  imports: [CommonModule, UiIconComponent, ClickOutsideDirective],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent implements OnInit, OnDestroy {

  @Input() menuOptions!: Observable<ContextMenuSection[]>;

  @Output() onMenuItemSelected = new EventEmitter<string>();

  readonly sections = signal<ContextMenuSection[]>([]);

  readonly isOpen = signal(false);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.menuOptions.pipe(takeUntil(this.destroy$)).subscribe(options => {
      this.sections.set(options);
    })
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  close() {
    this.isOpen.set(false);
  }

  toggle() {
    this.isOpen.set(!this.isOpen());
  }

  itemSelected(itemId: string) {
    this.onMenuItemSelected.next(itemId);
    this.close();
  }

}
