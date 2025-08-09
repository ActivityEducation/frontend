import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRecentFlashcards from './recent-flashcards.reducer';

export const selectRecentFlashcardsState = createFeatureSelector<fromRecentFlashcards.State>(
  'recentFlashcards'
);

export const selectRecentFlashcards = createSelector(
  selectRecentFlashcardsState,
  (state) => state.flashcards
);

export const selectRecentFlashcardsLoading = createSelector(
  selectRecentFlashcardsState,
  (state) => state.loading
);
