import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadReviewSchedule, selectReviewSchedule, selectReviewScheduleLoading } from '../../state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-review-schedule-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-schedule-widget.component.html',
  styleUrls: ['./review-schedule-widget.component.scss'],
})
export class ReviewScheduleWidgetComponent implements OnInit {
  private readonly store = inject(Store);

  public schedule$: Observable<any[]> = this.store.select(selectReviewSchedule);
  public loading$: Observable<boolean> = this.store.select(selectReviewScheduleLoading);

  ngOnInit(): void {
    this.store.dispatch(loadReviewSchedule());
  }
}
