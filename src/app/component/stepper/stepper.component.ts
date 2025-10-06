import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChild } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { StepperItemComponent } from '@src/app/component/stepper-item/stepper-item.component';

@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css'
})
export class StepperComponent implements AfterContentInit, OnDestroy {

  @Input() activeStep$!: Observable<string | null>;
  @Output() onStepSelected = new EventEmitter<string>();

  @ViewChild('stepperContainer', { static: false }) stepperContainer!: ElementRef;
  @ContentChildren(StepperItemComponent) steps!: QueryList<StepperItemComponent>;

  private readonly destroy$ = new Subject<void>();

  ngAfterContentInit(): void {
    this.activeStep$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value !== null) {
        this.selectStep(value, false);
      }
    });

    // select the first step by default unless a step is already active
    const activeSteps = this.steps.filter(step => step.active() === true);
    if (activeSteps.length === 0 && this.steps.first) {
      this.selectStep(this.steps.first.stepId, false);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectStep(stepId: string, publish: boolean = true) {
    for (const step of this.steps) {
      step.active.set(step.stepId === stepId);
    }

    if (publish === true) {
      this.onStepSelected.next(stepId);
    }
  }

}
