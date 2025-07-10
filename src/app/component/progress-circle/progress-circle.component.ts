import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { COLOR_LIGHT } from '@src/styles/constants';

@Component({
  selector: 'app-progress-circle',
  imports: [CommonModule],
  templateUrl: './progress-circle.component.html',
  styleUrl: './progress-circle.component.css'
})
export class ProgressCircleComponent implements AfterViewInit {

  @Input() percentage!: number;
  @Input() radius!: number;
  @Input() strokeWidth: number = 3;
  @Input() color = COLOR_LIGHT;
  @Input() transitionDelayMs = 0;

  internalValue = 0;
  styleAttribute = "";
  hidden = true;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.internalValue = this.percentage;
      this.styleAttribute = `--from:0; --to:${this.percentage}; --time:.5s;`;
      this.hidden = false;
    }, this.transitionDelayMs);
  }

  getNormalizedRadius(): number {
    return this.radius - (this.strokeWidth * 2);
  }

  getStrokeDashArray(): string {
    const circumference = this.getCircumference();
    return `${circumference} ${circumference}`
  }

  getStrokeDashOffset(): string {
    const circumference = this.getCircumference();
    const offset = circumference - (this.internalValue / 100) * circumference;
    return `${offset}`;
  }

  private getCircumference(): number {
    return this.getNormalizedRadius() * 2 * Math.PI;
  }
  
}
