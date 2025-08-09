import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  adapter,
  State as FeatureState,
  Flashcard,
} from './flashcards.reducer';
import { allModels } from './models.selectors';
import { Model } from './models.reducer';

export const flashcardsFeatureKey = 'flashcards';

export const flashcardsFeature =
  createFeatureSelector<FeatureState>(flashcardsFeatureKey);

const entitySelectors = adapter.getSelectors();

export const selectAllFlashcards = createSelector(
  flashcardsFeature,
  entitySelectors.selectAll
);

export const selectFlashcardsTotalCount = createSelector(
  flashcardsFeature,
  (state) => state.totalCount
);

export const selectFlashcardsPage = createSelector(
  flashcardsFeature,
  (state) => state.page
);

export const selectFlashcardsLimit = createSelector(
  flashcardsFeature,
  (state) => state.limit
);

export const selectFlashcardsTotalPages = createSelector(
  selectFlashcardsTotalCount,
  selectFlashcardsLimit,
  (totalCount, limit) => (limit === 0 ? 0 : Math.ceil(totalCount / limit))
);

export const selectSelectedModelIds = createSelector(
  flashcardsFeature,
  (state) => state.selectedModelIds
);

export const selectFlashcardsWithModels = createSelector(
  selectAllFlashcards,
  selectSelectedModelIds,
  (flashcards, selectedModelIds) => {
    return flashcards
      .map((flashcard) => {
        return {
          ...flashcard,
          model: (flashcard as any).eduModel,
        } as Flashcard & { model: Model };
      })
      .filter((flashcards) => flashcards.model !== null)
      .filter((flashcards) =>
        selectedModelIds.length == 0
          ? true
          : selectedModelIds.includes(flashcards.model.id)
      );
  }
);

export const selectFlashcardsLoading = createSelector(
  flashcardsFeature,
  (state) => state.loading
);

export const selectAllFlashcardsLoaded = createSelector(
  flashcardsFeature,
  (state) => state.allFlashcardsLoaded
);
