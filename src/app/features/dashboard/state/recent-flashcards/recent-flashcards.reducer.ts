import { createReducer, on } from '@ngrx/store';
import * as RecentFlashcardsActions from './recent-flashcards.actions';

export interface State {
  flashcards: any[];
  error: any;
  loading: boolean;
}

export const initialState: State = {
  flashcards: [],
  error: null,
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(RecentFlashcardsActions.loadRecentFlashcards, (state) => ({ ...state, loading: true })),
  on(RecentFlashcardsActions.loadRecentFlashcardsSuccess, (state, { flashcards }) => ({
    ...state,
    flashcards,
    loading: false,
  })),
  on(RecentFlashcardsActions.loadRecentFlashcardsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
