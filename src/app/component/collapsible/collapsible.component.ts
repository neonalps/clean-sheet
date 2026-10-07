import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { ChevronRightComponent } from "@src/app/icon/chevron-right/chevron-right.component";

@Component({
  selector: 'app-collapsible',
  imports: [ChevronRightComponent, CommonModule],
  templateUrl: './collapsible.component.html',
  styleUrl: './collapsible.component.css'
})
export class CollapsibleComponent implements AfterViewInit {
  
  readonly contentElement = viewChild.required<ElementRef<HTMLElement>>('content');

  readonly isOpen = input.required<boolean>();
  readonly chevronContainerClasses = input<string>();

  readonly elementMaxHeight = signal<string>('');

  readonly effectiveChevronContainerClasses = computed(() => {
    const currentIsOpen = this.isOpen();
    const externalContainerClasses = this.chevronContainerClasses();

    return [currentIsOpen ? 'rotate-90' : '', externalContainerClasses].join(' ');
  });

  readonly onClicked = output<void>();

  constructor() {
    effect(() => {
      this.updateElementMaxHeight(this.isOpen());
    });
  }

  ngAfterViewInit(): void {
    this.updateElementMaxHeight(this.isOpen());
  }

  private updateElementMaxHeight(open: boolean): void {
    this.elementMaxHeight.set(open ? `${this.contentElement().nativeElement.scrollHeight}px` : `0px`);
  }

}
