import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  catchError,
  combineLatestWith,
  filter,
  map,
  of,
  switchMap,
  take,
  tap,
  withLatestFrom,
  distinctUntilChanged,
  combineLatest,
} from 'rxjs';
import { FlashcardsActions } from './flashcards.actions';
import { FlashcardService } from '../services/flashcard.service';
import { Store } from '@ngrx/store';
import { modelById } from './models.selectors';
import {
  selectFlashcardsPage,
  selectFlashcardsLimit,
  selectFlashcardsTotalPages,
  selectAllFlashcards,
  selectFlashcardsTotalCount,
  selectFlashcardsLoading,
  selectAllFlashcardsLoaded,
} from './flashcards.selectors';
import { currentUsername } from '../../auth/state/session.selectors';
import { EduFlashcardModel } from './model.interface';
import { Model } from './models.reducer';
import { Flashcard } from './flashcards.reducer';
import { FlashcardData } from '../components/flashcard/flashcard.component';
import { SrsService } from '../services/srs.service';

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
      map((models: Model[]) =>
        FlashcardsActions.loadModelsSuccess({ data: models })
      )
    ),
  { functional: true, dispatch: true }
);

export const loadFlashcardsPageEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcardsPage),
      switchMap(({ page, limit }) =>
        flashcardService.getFlashcards(page, limit).pipe(
          map((response) => {
            return FlashcardsActions.loadFlashcardsPageSuccess({
              flashcards: response.data,
              totalCount: response.total,
              page,
              limit,
            });
          }),
          catchError((error) =>
            of(
              FlashcardsActions.loadFlashcardsPageFailure({ error }),
              FlashcardsActions.setLoadingStatus({ loading: false }),
              FlashcardsActions.setAllFlashcardsLoaded({ loaded: false })
            )
          )
        )
      )
    );
  },
  { functional: true }
);

export const loadFlashcardEffect = createEffect(
  (actions$ = inject(Actions), flashcardService = inject(FlashcardService)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcard),
      switchMap(({ activityPubId }) =>
        flashcardService.getFlashcardById(activityPubId).pipe(
          map((flashcard) => {
            return FlashcardsActions.loadFlashcardSuccess({ data: flashcard });
          }),
          catchError((error) => {
            return of(FlashcardsActions.loadFlashcardFailure({ error }));
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

export const createFlashcardEffect = createEffect(
  (
    actions$ = inject(Actions),
    flashcardService = inject(FlashcardService),
    store = inject(Store)
  ) =>
    actions$.pipe(
      ofType(FlashcardsActions.createFlashcard),
      withLatestFrom(store.select(currentUsername)),
      switchMap(([action, username]) => {
        if (!username) {
          console.error('Username not found in store. Cannot create flashcard.');
          return of(FlashcardsActions.loadFlashcardFailure({ error: 'Username not found' })); // Or a more specific error action
        }
        return flashcardService.createFlashcard(action.flashcard, username).pipe(
          map(({ activityPubId }) =>
            FlashcardsActions.loadFlashcard({ activityPubId })
          ),
          catchError((error) => {
            console.error('Error creating flashcard:', error);
            return of(FlashcardsActions.loadFlashcardFailure({ error }));
          })
        );
      })
    ),
  { functional: true, dispatch: true }
);


export const addFlashcardToReviewEffect = createEffect(
  (actions$ = inject(Actions), SRSService = inject(SrsService)) =>
    actions$.pipe(
      ofType(FlashcardsActions.addToReview),
      switchMap(({ flashcard }: { flashcard: Flashcard }) =>
        SRSService.addToReview({ flashcardActivityPubId: flashcard.activityPubId })
      )
    ),
  { functional: true, dispatch: false }
);

export const nextPageEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.nextPage),
      withLatestFrom(
        store.select(selectFlashcardsPage),
        store.select(selectFlashcardsTotalPages)
      ),
      filter(([, currentPage, totalPages]) => currentPage < totalPages),
      map(([, currentPage]) =>
        FlashcardsActions.changePage({ page: currentPage + 1 })
      )
    );
  },
  { functional: true }
);

export const previousPageEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.previousPage),
      withLatestFrom(store.select(selectFlashcardsPage)),
      filter(([, currentPage]) => currentPage > 1),
      map(([, currentPage]) =>
        FlashcardsActions.changePage({ page: currentPage - 1 })
      )
    );
  },
  { functional: true }
);

export const loadFlashcardsOnStateChangeEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return combineLatest([
      store.select(selectFlashcardsPage),
      store.select(selectFlashcardsLimit),
    ]).pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      ),
      map(([page, limit]) =>
        FlashcardsActions.loadFlashcardsPage({ page, limit })
      )
    );
  },
  { functional: true }
);

export const setAllFlashcardsLoadedEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.loadFlashcardsPageSuccess),
      withLatestFrom(
        store.select(selectAllFlashcards),
        store.select(selectFlashcardsTotalCount)
      ),
      map(([, allFlashcards, totalCount]) => {
        if (allFlashcards.length >= totalCount) {
          return FlashcardsActions.setAllFlashcardsLoaded({ loaded: true });
        } else {
          return FlashcardsActions.setAllFlashcardsLoaded({ loaded: false });
        }
      })
    );
  },
  { functional: true }
);

export const loadNextPageOnScrollEffect = createEffect(
  (actions$ = inject(Actions), store = inject(Store)) => {
    return actions$.pipe(
      ofType(FlashcardsActions.scrollReachedBottom),
      withLatestFrom(
        store.select(selectFlashcardsLoading),
        store.select(selectAllFlashcardsLoaded),
        store.select(selectFlashcardsPage),
        store.select(selectFlashcardsLimit)
      ),
      filter(([, loading, allLoaded]) => !loading && !allLoaded),
      map(([, , , currentPage, currentLimit]) =>
        FlashcardsActions.loadFlashcardsPage({
          page: currentPage + 1,
          limit: currentLimit,
        })
      )
    );
  },
  { functional: true }
);
