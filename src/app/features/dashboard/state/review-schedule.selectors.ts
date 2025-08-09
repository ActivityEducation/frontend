import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromReviewSchedule from './review-schedule.reducer';

export const selectReviewScheduleState = createFeatureSelector<fromReviewSchedule.State>(
  'reviewSchedule'
);

export const selectReviewSchedule = createSelector(
  selectReviewScheduleState,
  (state) => state.schedule
);

export const selectReviewScheduleLoading = createSelector(
  selectReviewScheduleState,
  (state) => state.loading
);
