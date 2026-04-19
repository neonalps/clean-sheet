import { CommonModule } from '@angular/common';
import { Component, input, OnInit, signal } from '@angular/core';
import { ManagerPeriod } from '@src/app/model/manager';
import { I18nPipe } from '@src/app/module/i18n/i18n.pipe';
import { UiIconComponent } from "@src/app/component/ui-icon/icon.component";
import { getPersonName } from '@src/app/util/domain';

@Component({
  selector: 'app-manager-period',
  imports: [CommonModule, I18nPipe, UiIconComponent],
  templateUrl: './manager-period.component.html',
})
export class ManagerPeriodComponent implements OnInit {

  readonly personName = signal<string>('');

  readonly period = input.required<ManagerPeriod>();

  ngOnInit(): void {
    this.personName.set(getPersonName(this.period().person));
  }

}
