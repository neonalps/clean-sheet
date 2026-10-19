import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { RecordSummary, Tendency } from '@src/app/model/game';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { TranslationService } from '@src/app/module/i18n/translation.service';
import { Nullish } from '@src/app/util/types';

@Component({
  selector: 'app-game-record-summary',
  imports: [CommonModule, I18nPipe],
  templateUrl: './game-record-summary.component.html'
})
export class GameRecordSummaryComponent {

  readonly recordSummary = input.required<RecordSummary>();
  readonly showExtendedSummary = input.required<boolean>();

  readonly tendencySelected = output<Nullish<Tendency>>();

  readonly gamesText = computed(() => this.translationService.translate(`gameRecord.game`, { plural: this.recordSummary().gameCount }));
  readonly winsText = computed(() => this.translationService.translate(`gameRecord.win`, { plural: this.recordSummary().win }));
  readonly drawsText = computed(() => this.translationService.translate(`gameRecord.draw`, { plural: this.recordSummary().draw }));
  readonly lossesText = computed(() => this.translationService.translate(`gameRecord.loss`, { plural: this.recordSummary().loss }));

  readonly averagePoints = computed(() => `Ø ${this.recordSummary().avgPointsFixed.replace('.', ',')}`);
  readonly winPercentage = computed(() => {
    const summary = this.recordSummary();
    return `${ Math.round(summary.win / summary.gameCount * 100) }%`;
  });

  private readonly translationService = inject(TranslationService);

  itemClicked(tendency: Nullish<Tendency>) {
    this.tendencySelected.emit(tendency);
  }

}
