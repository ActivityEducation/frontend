import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  combineLatestWith,
  filter,
  map,
  mergeMap,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { FlashcardsActions } from './flashcards.actions';
import { LoginActions } from '../../auth/state/login.actions';
import { JwtPayload } from '../../auth/jwt.interface';
import { FlashcardService } from '../services/flashcard.service';
import { Store } from '@ngrx/store';
import { modelById } from './models.selectors';
import { EduFlashcardModel } from './model.interface';
import { Model } from './models.reducer';
import { Flashcard } from './flashcards.reducer';
import { FlashcardData } from '../components/flashcard/flashcard.component';
import { SrsService } from '../services/srs.service';

export const initFlashcardsEffect = createEffect(
  (actions$ = inject(Actions)) => {
    return actions$.pipe(
      ofType(LoginActions.setCurrentUser),
      map(({ jwt }: { jwt: JwtPayload }) =>
        FlashcardsActions.loadFlashcards({ username: jwt.username })
      )
    );
  },
  { functional: true }
);

export const loadFlashcardsEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcards),
      switchMap(({ username }) =>
        flashcardService.getFlashcardsByUsername(username)
      ),
      switchMap((flashcards) => {
        return flashcards.orderedItems.map((id: string) => {
          return FlashcardsActions.loadFlashcard({ activityPubId: id });
        }) as any[];
      })
    );
  },
  { functional: true, dispatch: true }
);

export const loadFlashcardEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcard),
      mergeMap(({ activityPubId }) =>
        flashcardService.getFlashcardById(activityPubId).pipe(
          map((flashcard) => {
            return FlashcardsActions.loadFlashcardSuccess({ data: flashcard });
          }),
          catchError((error) => {
            return [FlashcardsActions.loadModelFailure({ error })];
          })
        )
      )
    );
  },
  { functional: true, dispatch: true }
);

export const loadModelEffect = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    flashcardService = inject(FlashcardService)
  ) =>
    actions$.pipe(
      ofType(FlashcardsActions.loadFlashcardSuccess),
      switchMap((action) =>
        store
          .select(modelById(action.data['edu:model']))
          .pipe(take(1), combineLatestWith(of(action)))
      ),
      filter(([entity]) => !entity),
      switchMap(([_, { data }]) =>
        flashcardService.getModelById(data['edu:model']).pipe(
          map((entity) => FlashcardsActions.loadModelSuccess({ data: entity })),
          catchError((error) => {
            console.error(error);
            return of(FlashcardsActions.loadModelFailure({ error }));
          })
        )
      )
    ),
  { functional: true, dispatch: true }
);

export const createModelEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) =>
    actions$.pipe(
      ofType(FlashcardsActions.createModel),
      switchMap(({ model }: { model: EduFlashcardModel }) =>
        flashcardService.createModel(model)
      ),
      map(({ activityPubId }) => FlashcardsActions.loadModel({ activityPubId }))
    ),
  { functional: true, dispatch: true }
);

export const loadModelsEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) =>
    actions$.pipe(
      ofType(FlashcardsActions.loadModels),
      switchMap(() => flashcardService.getAllModels()),
      switchMap((models: Model[]) =>
        models.map((model) =>
          FlashcardsActions.loadModelSuccess({ data: model })
        )
      )
    ),
  { functional: true, dispatch: true }
);

export const createFlashcardEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) =>
    actions$.pipe(
      ofType(FlashcardsActions.createFlashcard),
      switchMap(
        ({
          flashcard,
          username,
        }: {
          flashcard: FlashcardData;
          username: string;
        }) => flashcardService.createFlashcard(flashcard, username)
      ),
      map(({ activityPubId }) =>
        FlashcardsActions.loadFlashcard({ activityPubId })
      )
    ),
  { functional: true, dispatch: true }
);

export const addFlashcardToReviewEffect = createEffect(
  (actions$ = inject(Actions), SRSService = inject(SrsService)) =>
    actions$.pipe(
      ofType(FlashcardsActions.addToReview),
      tap((action) => console.log('addFlashcardToReviewEffect', action)),
      switchMap(({ flashcard }: { flashcard: Flashcard }) =>
        SRSService.addToReview({ flashcardActivityPubId: flashcard.id })
      )
    ),
  { functional: true, dispatch: false }
);
