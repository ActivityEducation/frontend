import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FlashcardsActions } from './flashcards.actions';

export const flashcardsFeatureKey = 'flashcards';

export interface Flashcard {
  id: string;
  activityPubId: string;
  type: string | string[] | ['edu:Flashcard', 'Document'];
  name: string;
  url: string;
  attributedTo: string;
  'edu:model': string;
  'edu:fieldsData': Record<string, string>;
  'edu:tags': string[];
}

export interface State extends EntityState<Flashcard> {}

export const adapter: EntityAdapter<Flashcard> =
  createEntityAdapter<Flashcard>({
    selectId: (flashcard) => flashcard.activityPubId || flashcard.id,
  });

export const initialState: State = {
  ids: [],
  entities: {},
};

export const reducer = createReducer(
  initialState,
  on(FlashcardsActions.loadFlashcardSuccess, (state, { data: flashcard }) =>
    adapter.upsertOne(flashcard, state)
  )
);
