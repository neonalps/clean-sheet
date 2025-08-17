import { Directive, HostListener } from "@angular/core";

@Directive({
  selector: '[appStopEventPropagation]'
})
export class StopEventPropagationDirective {

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    event.stopPropagation();
  }

}