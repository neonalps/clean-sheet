import { Component } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { ButtonComponent } from "@src/app/component/button/button.component";
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

@Component({
  selector: 'app-delete-modal',
  imports: [I18nPipe, ModalComponent, ButtonComponent, UiIconComponent],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {

}
