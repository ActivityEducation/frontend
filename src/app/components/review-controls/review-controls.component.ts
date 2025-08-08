import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewRating } from '../../types/srs.types';

@Component({
  selector: 'app-review-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-controls.component.html',
  styleUrls: ['./review-controls.component.scss']
})
export class ReviewControlsComponent {
  @Input() isDisabled = false;
  @Output() rate = new EventEmitter<ReviewRating>();

  onRate(rating: ReviewRating): void {
    this.rate.emit(rating);
  }
}
