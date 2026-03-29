import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appScrollNearEnd]',
  standalone: true
})
export class ScrollNearEndDirective {

  @Output() nearEnd: EventEmitter<void> = new EventEmitter<void>();

  /**
   * threshold in PX when to emit before page end scroll
   */
  @Input() threshold: number = 120;

  constructor(private el: ElementRef) {}

  @HostListener('window:scroll', ['$event.target'])
  windowScrollEvent() {
    // height of whole window page
    const heightOfWholePage = window.document.documentElement.scrollHeight;

    // how big in pixels the element is
    const heightOfElement = this.el.nativeElement.scrollHeight;

    // currently scrolled Y position
    const currentScrolledY = window.scrollY;

    // height of opened window - shrinks if console is opened
    const innerHeight = window.innerHeight;

   /**
    * the area between the start of the page and when this element is visible
    * in the parent component
    */
    const spaceOfElementAndPage = heightOfWholePage - heightOfElement;

    // calculated whether we are near the end
    const scrollToBottom =
      heightOfElement - innerHeight - currentScrolledY + spaceOfElementAndPage;

    // if the user is near end
    if (scrollToBottom < this.threshold) {
      this.nearEnd.emit();
    }
  }

}