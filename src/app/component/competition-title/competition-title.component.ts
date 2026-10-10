import { Component, input } from '@angular/core';
import { CompetitionTitle } from '@src/app/model/season';

@Component({
  selector: 'app-competition-title',
  imports: [],
  templateUrl: './competition-title.component.html'
})
export class CompetitionTitleComponent {

  competitionTitle = input.required<CompetitionTitle>();

}
