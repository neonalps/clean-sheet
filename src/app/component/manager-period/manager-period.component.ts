import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ManagerPeriod } from '@src/app/model/manager';
import { getPersonName } from '@src/app/util/domain';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { ensureNotNullish, isNotDefined } from '@src/app/util/common';
import { PersonCardComponent } from "@src/app/component/person-card/person-card.component";
import { SeasonTitleSmallComponent } from "@src/app/component/season-title-small/season-title-small.component";
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { getNumberOfDaysBetween } from '@src/app/util/date';

@Component({
  selector: 'app-manager-period',
  imports: [CommonModule, I18nPipe, PersonCardComponent, SeasonTitleSmallComponent],
  templateUrl: './manager-period.component.html',
})
export class ManagerPeriodComponent implements OnInit {

  readonly avgPoints = signal('');
  readonly durationDaysText = signal('');
  readonly winPercentage = signal('');
  readonly durationText = signal('');
  readonly personName = signal('');
  
  readonly gamesI18nPlural = signal('');
  readonly winsI18nPlural = signal('');
  readonly drawsI18nPlural = signal('');
  readonly lossesI18nPlural = signal('');

  readonly period = input.required<ManagerPeriod>();

  private readonly datePipe = new DatePipe('en-US');
  private readonly translationService = inject(TranslationService);

  ngOnInit(): void {
    const periodValue = this.period();
    this.personName.set(getPersonName(periodValue.person));

    this.avgPoints.set(`Ø ${periodValue.summary.avgPointsFixed.replace('.', ',')}`);
    this.winPercentage.set(`${ Math.round(periodValue.summary.win / periodValue.summary.gameCount * 100) }%`);

    this.gamesI18nPlural.set(this.translationService.translate('gameRecord.game', { plural: periodValue.summary.gameCount }));
    this.winsI18nPlural.set(this.translationService.translate('gameRecord.win', { plural: periodValue.summary.win }));
    this.drawsI18nPlural.set(this.translationService.translate('gameRecord.draw', { plural: periodValue.summary.draw }));
    this.lossesI18nPlural.set(this.translationService.translate('gameRecord.loss', { plural: periodValue.summary.loss }));

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

}
