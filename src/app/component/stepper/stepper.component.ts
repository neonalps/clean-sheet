import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, contentChildren, effect, ElementRef, input, viewChild } from '@angular/core';
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
  templateUrl: './stepper.component.html'
})
export class StepperComponent implements AfterContentInit {

  readonly stepConfig = input.required<StepConfig[]>();

  readonly stepperContainerElement = viewChild.required<ElementRef<HTMLElement>>('stepperContainer');

  readonly steps = contentChildren(StepperItemComponent);

  constructor() {
    effect(() => {
      const currentStepConfig = this.stepConfig();

      this.steps().forEach(step => {
          const configUpdate = currentStepConfig.find(item => item.stepId === step.stepId());
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

          if (configUpdate.hidden !== undefined) {
            step.hidden.set(configUpdate.hidden);
          }
        });
    });
  }

  ngAfterContentInit(): void {
    // select the first step by default unless a step is already active
    const stepsValue = this.steps();
    const activeSteps = stepsValue.filter(step => step.active() === true);
    if (activeSteps.length === 0 && stepsValue.length > 0) {
      this.selectStep(stepsValue[0].stepId());
    }
  }

  selectStep(stepId: string) {
    for (const step of this.steps()) {
      step.active.set(step.stepId() === stepId);
    }
  }

}
