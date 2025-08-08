import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Type Definitions ---
export type ProgressBarVariant = 'default' | 'success' | 'warning' | 'error';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent {
  /**
   * The title to display above the progress bar.
   */
  @Input() title?: string;

  /**
   * The current value of the progress.
   */
  @Input() value = 0;

  /**
   * The total or maximum value for the progress.
   * @default 100
   */
  @Input() total = 100;

  /**
   * The color variant of the progress bar.
   * @default 'default'
   */
  @Input() variant: ProgressBarVariant = 'default';

  /**
   * Calculates the progress percentage, ensuring it's between 0 and 100.
   */
  get percentage(): number {
    if (this.total === 0) {
      return 0;
    }
    const calculatedPercentage = (this.value / this.total) * 100;
    return Math.max(0, Math.min(100, calculatedPercentage));
  }
}
