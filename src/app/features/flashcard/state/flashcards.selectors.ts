import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, State as FeatureState, Flashcard } from './flashcards.reducer';
import { allModels } from './models.selectors';

export const flashcardsFeatureKey = 'flashcards';

export const flashcardsFeature =
  createFeatureSelector<FeatureState>(flashcardsFeatureKey);

const entitySelectors = adapter.getSelectors();

export const flashcards = createSelector(
  flashcardsFeature,
  entitySelectors.selectEntities,
);

export const allFlashcards = createSelector(
  flashcards,
  (flashcards) => Object.values(flashcards) as Flashcard[],
)

export const combinedFlashcard = createSelector(
  allFlashcards,
  allModels,
  (flashcards, models) => flashcards.map(flashcard => {
    if (!flashcard) return null;
    const model = models.find(m => m?.activityPubId === flashcard?.['edu:model']);
    if (!model) return null;

    return {
      ...flashcard,
      model: model,
    }
  }).filter(item => item !== null)
)