import { Component, input } from '@angular/core';
import { ManagerPeriod } from '@src/app/model/manager';

@Component({
  selector: 'app-manager-period',
  imports: [],
  templateUrl: './manager-period.component.html',
})
export class ManagerPeriodComponent {

  readonly period = input.required<ManagerPeriod>();

}
