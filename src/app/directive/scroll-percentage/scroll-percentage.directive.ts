import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollPercentage]',
  standalone: true,
})
export class ScrollPercentageDirective {

  @Output() reachedThreshold = new EventEmitter<void>();

  private readonly threshold = 0.8; // 80%

  constructor(private el: ElementRef) {
    console.log('directive init');
  }

  @HostListener('window:scroll', ['$event.target'])
  onScroll(): void {
    const element = this.el.nativeElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;

    const scrollPosition = scrollTop + clientHeight;
    const percentScrolled = scrollPosition / scrollHeight;

    // Emit once when the threshold is reached
    if (percentScrolled >= this.threshold) {
      this.reachedThreshold.emit();
    }
  }
}
