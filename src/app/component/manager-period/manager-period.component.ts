import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ManagerPeriod } from '@src/app/model/manager';
import { getPersonName } from '@src/app/util/domain';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ensureNotNullish, isNotDefined } from '@src/app/util/common';
import { PersonCardComponent } from "@src/app/component/person-card/person-card.component";

@Component({
  selector: 'app-manager-period',
  imports: [CommonModule, PersonCardComponent],
  templateUrl: './manager-period.component.html',
})
export class ManagerPeriodComponent implements OnInit {

  readonly durationText = signal('');
  readonly personName = signal('');

  readonly period = input.required<ManagerPeriod>();

  private readonly datePipe = new DatePipe('en-US');
  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    const periodValue = this.period();
    this.personName.set(getPersonName(periodValue.person));

    const startDate = ensureNotNullish(this.datePipe.transform(new Date(periodValue.start)));
    const endDate = periodValue.end ? this.datePipe.transform(new Date(periodValue.end)) : undefined;

    if (isNotDefined(periodValue.end)) {
      this.durationText.set(this.translationService.translate('managerPeriod.since', { since: startDate }));
    } else {
      this.durationText.set(this.translationService.translate('managerPeriod.fromTo', { from: startDate, to: ensureNotNullish(endDate) }));
    }
  }

}
