import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, ElementRef, Input, OnDestroy, QueryList, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StepperItemComponent } from '@src/app/component/stepper-item/stepper-item.component';

export type StepConfig = {
  stepId: string;
  active?: boolean;
  completed?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  displayName?: string;
}

@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent implements AfterContentInit, OnDestroy {

  @Input() stepConfig$!: Observable<StepConfig[]>;

  @ViewChild('stepperContainer', { static: false }) stepperContainer!: ElementRef;
  @ContentChildren(StepperItemComponent) steps!: QueryList<StepperItemComponent>;

  private readonly destroy$ = new Subject<void>();

  ngAfterContentInit(): void {
    // select the first step by default unless a step is already active
    const activeSteps = this.steps.filter(step => step.active() === true);
    if (activeSteps.length === 0 && this.steps.first) {
      this.selectStep(this.steps.first.stepId, false);
    }

    this.stepConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(config => {
        console.log('received config update', config);
        this.steps.forEach(step => {
          const configUpdate = config.find(item => item.stepId === step.stepId);
          if (!configUpdate) {
            return;
          }

          if (configUpdate.active !== undefined) {
            step.active.set(configUpdate.active);
          }

          if (configUpdate.completed !== undefined) {
            step.completed.set(configUpdate.completed);
          }

          if (configUpdate.disabled !== undefined) {
            step.disabled.set(configUpdate.disabled); 
          }

          if (configUpdate.displayName !== undefined) {
            step.displayName = configUpdate.displayName;
          }

          if (configUpdate.hidden !== undefined) {
            step.hidden.set(configUpdate.hidden);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectStep(stepId: string, publish: boolean = true) {
    for (const step of this.steps) {
      step.active.set(step.stepId === stepId);
    }
  }

}
