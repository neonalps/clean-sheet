import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
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

  readonly elementMaxHeight = signal<string>('');

  readonly onClicked = output<void>();

  constructor() {
    effect(() => {
      this.elementMaxHeight.set(this.isOpen() ? `${this.contentElement().nativeElement.scrollHeight}px` : '0px');
    });
  }

  ngAfterViewInit(): void {
    this.elementMaxHeight.set(this.isOpen() ? `${this.contentElement().nativeElement.scrollHeight}px` : '0px');
  }

}
