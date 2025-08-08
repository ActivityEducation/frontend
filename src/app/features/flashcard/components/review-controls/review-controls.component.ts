/*
* =================================================================
*
* ## 🕹️ Review Controls Component (Logic)
*
* This component now uses Angular Material buttons.
*
* **File:** src/app/features/review-session/components/review-controls/review-controls.component.ts
*
* =================================================================
*/
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-review-controls',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './review-controls.component.html',
  styleUrls: ['./review-controls.component.scss']
})
export class ReviewControlsComponent {
  @Output() rate = new EventEmitter<number>();

  onRate(rating: number): void {
    this.rate.emit(rating);
  }
}
