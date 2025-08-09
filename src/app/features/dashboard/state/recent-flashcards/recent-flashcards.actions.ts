import { createAction, props } from '@ngrx/store';

export const loadRecentFlashcards = createAction('[Recent Flashcards] Load Recent Flashcards');

export const loadRecentFlashcardsSuccess = createAction(
  '[Recent Flashcards] Load Recent Flashcards Success',
  props<{ flashcards: any[] }>()
);

export const loadRecentFlashcardsFailure = createAction(
  '[Recent Flashcards] Load Recent Flashcards Failure',
  props<{ error: any }>()
);
