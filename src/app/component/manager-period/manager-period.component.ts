import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ManagerPeriod, ManagerPeriodForPerson } from '@src/app/model/manager';
import { getPersonName } from '@src/app/util/domain';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ensureNotNullish, isDefined, isNotDefined } from '@src/app/util/common';
import { PersonCardComponent } from "@src/app/component/person-card/person-card.component";
import { SeasonTitleSmallComponent } from "@src/app/component/season-title-small/season-title-small.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { getNumberOfDaysBetween } from '@src/app/util/date';
import { GamePlayedFilterOptions } from '@src/app/model/game-played';
import { Tendency } from '@src/app/model/game';
import { Nullish } from '@src/app/util/types';
import { Person } from '@src/app/model/person';
import { GameRecordSummaryComponent } from '@src/app/component/game-record-summary/game-record-summary.component';

@Component({
  selector: 'app-manager-period',
  imports: [CommonModule, I18nPipe, PersonCardComponent, SeasonTitleSmallComponent, GameRecordSummaryComponent],
  templateUrl: './manager-period.component.html',
})
export class ManagerPeriodComponent implements OnInit {

  readonly filterOptionsSelected = output<GamePlayedFilterOptions>();

  readonly managerPerson = signal<Person | null>(null);

  readonly durationDaysText = signal('');
  readonly durationText = signal('');
  readonly personName = signal('');

  readonly period = input.required<ManagerPeriod | ManagerPeriodForPerson>();

  private readonly datePipe = new DatePipe('en-US');
  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    const periodValue = this.period();

    if ('person' in periodValue) {
      this.managerPerson.set(periodValue.person);
      this.personName.set(getPersonName(periodValue.person));
    }

    const startDate = ensureNotNullish(this.datePipe.transform(new Date(periodValue.start)));
    const endDate = periodValue.end ? this.datePipe.transform(new Date(periodValue.end)) : undefined;

    const durationDays = periodValue.end ? getNumberOfDaysBetween(new Date(periodValue.end), new Date(periodValue.start)) : getNumberOfDaysBetween(new Date(), new Date(periodValue.start));
    this.durationDaysText.set(`${durationDays} ${this.translationService.translate('duration.day', { plural: durationDays })}`);

    if (isNotDefined(periodValue.end)) {
      this.durationText.set(this.translationService.translate('managerPeriod.since', { since: startDate }));
    } else {
      this.durationText.set(this.translationService.translate('managerPeriod.fromTo', { from: startDate, to: ensureNotNullish(endDate) }));
    }
  }

  itemClicked(tendency: Nullish<Tendency>) {
    const filterPayload: GamePlayedFilterOptions = {
      onlyManager: true,
    }

    if (isDefined(tendency)) {
      filterPayload.tendency = tendency;
    }

    this.filterOptionsSelected.emit(filterPayload);
  }

}
