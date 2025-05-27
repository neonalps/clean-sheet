import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectComponent } from '@src/app/component/select/select.component';
import { Season } from '@src/app/model/season';
import { Observable } from 'rxjs';
import { OptionId } from '@src/app/component/select/option';

@Component({
  selector: 'app-season-select',
  imports: [SelectComponent],
  templateUrl: './season-select.component.html',
  styleUrl: './season-select.component.css'
})
export class SeasonSelectComponent {

  @Input() seasons!: Observable<Season[]>;
  @Input() selectedSeasonId?: number;
  @Output() onSelected = new EventEmitter<OptionId>();

  onSeasonSelected(selectedSeasonId: OptionId): void {
    this.onSelected.emit(selectedSeasonId);
  }

}
