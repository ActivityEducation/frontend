import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, filter } from 'rxjs/operators';
import { of, take } from 'rxjs';
import * as RecentFlashcardsActions from './recent-flashcards.actions';
import { FlashcardService } from '../../../flashcard/services/flashcard.service';
import { Store } from '@ngrx/store';
import { currentUsername } from '../../../auth/state/session.selectors';
import { LoginActions } from '../../../auth/state/login.actions';

export const loadRecentFlashcards$ = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService), store = inject(Store)) => {
    return actions$.pipe(
      ofType(LoginActions.setCurrentUser),
      switchMap(() => store.select(currentUsername).pipe(take(1))),
      filter(username => !!username),
      mergeMap(() =>
        flashcardService.getFlashcards(1, 5).pipe(
          map((response) => RecentFlashcardsActions.loadRecentFlashcardsSuccess({ flashcards: response.data })),
          catchError((error) => of(RecentFlashcardsActions.loadRecentFlashcardsFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);
