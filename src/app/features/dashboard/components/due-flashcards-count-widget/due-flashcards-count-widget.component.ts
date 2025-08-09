import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectReviewSchedule, selectReviewScheduleLoading } from '../../state';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-due-flashcards-count-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './due-flashcards-count-widget.component.html',
  styleUrls: ['./due-flashcards-count-widget.component.scss'],
})
export class DueFlashcardsCountWidgetComponent implements OnInit {
  private readonly store = inject(Store);

  public dueCount$: Observable<number> = this.store.select(selectReviewSchedule).pipe(
    map(schedule => schedule.length)
  );
  public loading$: Observable<boolean> = this.store.select(selectReviewScheduleLoading);

  ngOnInit(): void {
    // The loadReviewSchedule action is already dispatched by the review-schedule-widget
  }
}
