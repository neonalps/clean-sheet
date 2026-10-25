import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { Person } from '@src/app/model/person';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { Nullish } from '@src/app/util/types';

export type ModifyPersonPayload = {
  person: Person;
};

export type ModifyPersonConfirmPayload = {
  firstName: string;
  lastName: string;
  birthday: Nullish<Date>;
  deathday: Nullish<Date>;
  nationalities: string[];
}

@Component({
  selector: 'app-modal-modify-person',
  imports: [CommonModule, ModalComponent, I18nPipe, ButtonComponent],
  templateUrl: './modal-modify-person.component.html' 
})
export class ModalModifyPersonComponent implements OnInit, OnDestroy {

  readonly firstNameElement = viewChild.required<ElementRef<HTMLInputElement>>('firstName');
  readonly lastNameElement = viewChild.required<ElementRef<HTMLInputElement>>('lastName');

  readonly person = computed(() => this.currentPayload()?.person);

  readonly avatarValue = signal<string>('');
  readonly firstNameValue = signal<string>('');
  readonly lastNameValue = signal<string>('');
  readonly birthdayValue = signal<Date | null>(null);
  readonly deathdayValue = signal<Date | null>(null);
  readonly nationalitiesValue = signal<string[]>([]);

  private readonly currentPayload = signal<ModifyPersonPayload | null>(null);

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.modifyPersonPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        this.currentPayload.set(payload);

        const currentFirstName = payload.person.firstName ?? '';
        this.firstNameValue.set(currentFirstName);
        this.firstNameElement().nativeElement.value = currentFirstName;

        const currentLastName = payload.person.lastName;
        this.lastNameValue.set(currentLastName);
        this.lastNameElement().nativeElement.value = currentLastName;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFirstNameChange(): void {
    const newFirstNameValue = this.firstNameElement().nativeElement.value;
    this.firstNameValue.set(newFirstNameValue);
  }

  onLastNameChange(): void {
    const newLastNameValue = this.lastNameElement().nativeElement.value;
    this.lastNameValue.set(newLastNameValue);
  }

  onCancel() {
      this.modalService.onCancel();

      setTimeout(() => this.resetModal(), 200);
    }
  
    onConfirm() {
      this.modalService.onConfirm({
        firstName: this.firstNameValue(),
        lastName: this.lastNameValue(),
        birthday: this.birthdayValue() ?? undefined,
        deathday: this.deathdayValue() ?? undefined,
        nationalities: this.nationalitiesValue(),
      } satisfies ModifyPersonConfirmPayload);

      setTimeout(() => this.resetModal(), 200);
    }

  private resetModal() {
    this.currentPayload.set(null);

    this.firstNameElement().nativeElement.value = '';
    this.firstNameValue.set('');

    this.lastNameElement().nativeElement.value = '';
    this.lastNameValue.set('');
  }

}
