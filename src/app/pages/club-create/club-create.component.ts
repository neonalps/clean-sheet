import { Component, computed, inject, OnDestroy, signal } from "@angular/core";
import { Subject } from "rxjs";
import { BaseClubInformation, ModifyBaseClubComponent } from "@src/app/component/modify-base-club/modify-base-club.component";
import { I18nPipe } from "@src/app/module/i18n/i18n.pipe";
import { ClubService } from "@src/app/module/club/service";
import { ButtonComponent } from "@src/app/component/button/button.component";

@Component({
  selector: 'app-club-create',
  imports: [I18nPipe, ModifyBaseClubComponent, ButtonComponent],
  templateUrl: './club-create.component.html'
})
export class ClubCreateComponent implements OnDestroy {

  private readonly clubService = inject(ClubService);

  private readonly currentBaseClubInformation = signal<BaseClubInformation | null>(null);
  private readonly isSubmitting = signal(false);

  readonly canBeSaved = computed<boolean>(() => !this.isSubmitting() && this.currentBaseClubInformation() !== null);

  private readonly destroy$ = new Subject<void>();

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

  onBaseClubUpdate(baseClubUpdate: BaseClubInformation): void {
    console.log('got that', baseClubUpdate)
    this.currentBaseClubInformation.set(baseClubUpdate);
  }

  onCancel(): void {
    console.log('cancel now');
  }

  onConfirm(): void {
    if (this.isSubmitting()) {
      throw new Error(`Cannot submit again`);
    }

    this.isSubmitting.set(true);
    console.log('submitting');
  }

}