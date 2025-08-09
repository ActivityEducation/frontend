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

export interface State extends EntityState<Flashcard> {
  totalCount: number;
  page: number;
  limit: number;
  selectedModelIds: string[];
  loading: boolean;
  allFlashcardsLoaded: boolean;
}

export const adapter: EntityAdapter<Flashcard> =
  createEntityAdapter<Flashcard>({
    selectId: (flashcard) => flashcard.activityPubId || flashcard.id,
  });

export const initialState: State = {
  ids: [],
  entities: {},
  totalCount: 0,
  page: 1,
  limit: 10,
  selectedModelIds: [],
  loading: false,
  allFlashcardsLoaded: false,
};

export const reducer = createReducer(
  initialState,
  on(FlashcardsActions.loadFlashcardSuccess, (state, { data: flashcard }) =>
    adapter.upsertOne(flashcard, state)
  ),
  on(FlashcardsActions.loadFlashcardsPageSuccess, (state, { flashcards, totalCount, page, limit }) =>
    adapter.upsertMany(flashcards, { ...state, totalCount, page, limit, loading: false })
  ),
  on(FlashcardsActions.loadMoreFlashcardsSuccess, (state, { flashcards, totalCount, page, limit }) =>
    adapter.upsertMany(flashcards, { ...state, totalCount, page, limit, loading: false })
  ),
  on(FlashcardsActions.changePage, (state, { page }) => ({ ...state, page })),
  on(FlashcardsActions.changeItemsPerPage, (state, { itemsPerPage }) => ({ ...state, limit: itemsPerPage, page: 1 })),
  on(FlashcardsActions.toggleModelFilter, (state, { modelIds }) => ({ ...state, selectedModelIds: modelIds })),
  on(FlashcardsActions.setLoadingStatus, (state, { loading }) => ({ ...state, loading })),
  on(FlashcardsActions.setAllFlashcardsLoaded, (state, { loaded }) => ({ ...state, allFlashcardsLoaded: loaded }))
);