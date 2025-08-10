import { Component, inject } from '@angular/core';
import { ClickOutsideDirective } from '@src/app/directive/click-outside/click-outside.directive';
import { ModalService } from '@src/app/module/modal/service';

@Component({
  selector: 'app-modal',
  imports: [ClickOutsideDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  private readonly modalService = inject(ModalService);

  handleOutsideClick() {
    this.modalService.outsideClicked();
  }

}
