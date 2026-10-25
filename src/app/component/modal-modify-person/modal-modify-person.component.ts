import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { Person } from '@src/app/model/person';

export type ModifyPersonPayload = {
  person: Person;
};

@Component({
  selector: 'app-modal-modify-person',
  imports: [CommonModule, ModalComponent, I18nPipe],
  templateUrl: './modal-modify-person.component.html' 
})
export class ModalModifyPersonComponent implements OnInit, OnDestroy {

  readonly person = computed(() => this.currentPayload()?.person);

  private readonly currentPayload = signal<ModifyPersonPayload | null>(null);

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.modifyPersonPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resetModal() {
    this.currentPayload.set(null);
  }

}
