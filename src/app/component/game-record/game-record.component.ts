import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslationService } from '@src/app/module/i18n/translation.service';

export type GameRecord = {
  w: number;
  d: number;
  l: number;
}

@Component({
  selector: 'app-game-record',
  imports: [CommonModule],
  templateUrl: './game-record.component.html',
  styleUrl: './game-record.component.css'
})
export class GameRecordComponent {

  readonly gameRecord = input.required<GameRecord>();

  readonly winsText = computed(() => this.translationService.translate(`gameRecord.win`, { plural: this.gameRecord().w }));
  readonly drawsText = computed(() => this.translationService.translate(`gameRecord.draw`, { plural: this.gameRecord().d }));
  readonly lossesText = computed(() => this.translationService.translate(`gameRecord.loss`, { plural: this.gameRecord().l }));

  private readonly translationService = inject(TranslationService);

}
