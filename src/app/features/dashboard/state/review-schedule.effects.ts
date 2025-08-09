import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as ReviewScheduleActions from './review-schedule.actions';
import { SrsService } from '../services/srs.service';

export const loadReviewScheduleEffect = createEffect(
  (actions$ = inject(Actions), srsService = inject(SrsService)) => {
    return actions$.pipe(
      ofType(ReviewScheduleActions.loadReviewSchedule),
      mergeMap(() =>
        srsService.getReviewSchedule().pipe(
          map((schedule) =>
            ReviewScheduleActions.loadReviewScheduleSuccess({ schedule })
          ),
          catchError((error) =>
            of(ReviewScheduleActions.loadReviewScheduleFailure({ error }))
          )
        )
      )
    );
  },
  { functional: true }
);
