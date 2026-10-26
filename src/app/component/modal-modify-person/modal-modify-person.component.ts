import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { ModalComponent } from '@src/app/component/modal/modal.component';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { ModalService } from '@src/app/module/modal/service';
import { Subject, takeUntil } from 'rxjs';
import { Person } from '@src/app/model/person';
import { ButtonComponent } from '@src/app/component/button/button.component';
import { Nullish } from '@src/app/util/types';
import { SelectNationalitiesComponent } from '@src/app/component/select-nationalities/select-nationalities.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';

export type ModifyPersonPayload = {
  person: Person;
};

export type ModifyPersonConfirmPayload = {
  firstName: string;
  lastName: string;
  birthday: Nullish<string>;
  deathday: Nullish<string>;
  nationalities: string[];
}

@Component({
  selector: 'app-modal-modify-person',
  imports: [CommonModule, ModalComponent, I18nPipe, ButtonComponent, SelectNationalitiesComponent, DatePickerComponent],
  templateUrl: './modal-modify-person.component.html' 
})
export class ModalModifyPersonComponent implements OnInit, OnDestroy {

  readonly firstNameElement = viewChild.required<ElementRef<HTMLInputElement>>('firstName');
  readonly lastNameElement = viewChild.required<ElementRef<HTMLInputElement>>('lastName');

  readonly person = computed(() => this.currentPayload()?.person);

  readonly avatarValue = signal<string>('');
  readonly firstNameValue = signal<string>('');
  readonly lastNameValue = signal<string>('');
  readonly birthdayValue = signal<string | null>(null);
  readonly deathdayValue = signal<string | null>(null);
  readonly nationalitiesValue = signal<string[]>([]);

  private readonly currentPayload = signal<ModifyPersonPayload | null>(null);

  private readonly modalService = inject(ModalService);

  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.modalService.modifyPersonPayload$
      .pipe(takeUntil(this.destroy$))
      .subscribe(payload => {
        console.log(payload);
        this.currentPayload.set(payload);

        const currentFirstName = payload.person.firstName ?? '';
        this.firstNameValue.set(currentFirstName);
        this.firstNameElement().nativeElement.value = currentFirstName;

        const currentLastName = payload.person.lastName;
        this.lastNameValue.set(currentLastName);
        this.lastNameElement().nativeElement.value = currentLastName;

        const currentNationalities = payload.person.nationalities ?? [];
        this.nationalitiesValue.set(currentNationalities);

        const currentBirthday = payload.person.birthday ?? null;
        this.birthdayValue.set(currentBirthday);
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

  onNationalitiesChanged(newValue: string[]): void {
    this.nationalitiesValue.set([...newValue]);
  }

  onBirthdayChanged(newValue: Nullish<string>): void {
    this.birthdayValue.set(newValue ?? null);
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
