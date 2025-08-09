import { createAction, props } from '@ngrx/store';

export const loadReviewSchedule = createAction('[Review Schedule] Load Review Schedule');

export const loadReviewScheduleSuccess = createAction(
  '[Review Schedule] Load Review Schedule Success',
  props<{ schedule: any[] }>()
);

export const loadReviewScheduleFailure = createAction(
  '[Review Schedule] Load Review Schedule Failure',
  props<{ error: any }>()
);
