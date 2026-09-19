import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { PersonId } from '@src/app/util/domain-types';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";

export type ShirtModalPayload = {
  personId: PersonId;
  personName: string;
  avatar?: string;
  shirt: number;
  unavailable: Set<number>;
};

type Grid = GridRow[];

type GridRow = {
  columns: GridColumn[];
}

type GridColumn = {
  shirt: number;
  empty: boolean;
  selected?: boolean;
  available?: boolean;
}

@Component({
  selector: 'app-shirt-selector',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './shirt-selector.component.html',
})
export class ShirtSelectorComponent {

  readonly selectedShirt = input.required<number | null>();

  readonly personName = input<string | null>(null);
  readonly personAvatar = input<string | null>(null);
  readonly unavailableShirts = input<number[]>([]);

  readonly onShirtSelected = output<number>();

  readonly currentStage = signal(1);
  readonly numberGroup = signal(0);
  readonly stageTwoGrid = computed<Grid>(() => {
    const selected = this.selectedShirt();
    const groupStart = this.numberGroup();
    const unavailable = this.unavailableShirts();

    return [
      {
        columns: [
          { shirt: groupStart + 1, empty: false, selected: selected === groupStart + 1, available: unavailable.indexOf(groupStart + 1) < 0 },
          { shirt: groupStart + 2, empty: false, selected: selected === groupStart + 2, available: unavailable.indexOf(groupStart + 2) < 0 },
          { shirt: groupStart + 3, empty: false, selected: selected === groupStart + 3, available: unavailable.indexOf(groupStart + 3) < 0 },
          { shirt: groupStart + 4, empty: false, selected: selected === groupStart + 4, available: unavailable.indexOf(groupStart + 4) < 0 },
        ],
      },
      {
        columns: [
          { shirt: groupStart + 5, empty: false, selected: selected === groupStart + 5, available: unavailable.indexOf(groupStart + 5) < 0 },
          { shirt: groupStart + 6, empty: false, selected: selected === groupStart + 6, available: unavailable.indexOf(groupStart + 6) < 0 },
          { shirt: groupStart + 7, empty: false, selected: selected === groupStart + 7, available: unavailable.indexOf(groupStart + 7) < 0 },
          { shirt: groupStart + 8, empty: false, selected: selected === groupStart + 8, available: unavailable.indexOf(groupStart + 8) < 0 },
        ],
      },
      {
        columns: [
          { shirt: groupStart + 9, empty: false, selected: selected === groupStart + 9, available: unavailable.indexOf(groupStart + 9) < 0 },
          { shirt: groupStart !== 90 ? groupStart + 10 : 0, empty: groupStart === 90, selected: selected === groupStart + 10, available: unavailable.indexOf(groupStart + 10) < 0 },
          { shirt: 0, empty: true, },
          { shirt: 0, empty: true, },
        ],
      }
    ];
  });

  selectNumberGroup(groupStart: number) {
    this.numberGroup.set(groupStart);
    this.selectStage(2);
  }

  selectShirt(shirt: number) {
    this.onShirtSelected.emit(shirt);
  }

  selectStage(stage: number) {
    this.currentStage.set(stage);
  }

}
