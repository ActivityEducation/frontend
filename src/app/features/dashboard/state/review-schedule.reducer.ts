import { createReducer, on } from '@ngrx/store';
import * as ReviewScheduleActions from './review-schedule.actions';

export interface State {
  schedule: any[];
  error: any;
  loading: boolean;
}

export const initialState: State = {
  schedule: [],
  error: null,
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(ReviewScheduleActions.loadReviewSchedule, (state) => ({ ...state, loading: true })),
  on(ReviewScheduleActions.loadReviewScheduleSuccess, (state, { schedule }) => ({
    ...state,
    schedule,
    loading: false,
  })),
  on(ReviewScheduleActions.loadReviewScheduleFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
