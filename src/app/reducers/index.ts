import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { reducer as authReducer, State as authState } from '../features/auth/state/auth.reducer';
import { reducer as actorReducer, State as actorState } from '../features/actor/state/actor.reducer';
import { reducer as flashcardReducer, State as flashcardState } from '../features/flashcard/state/flashcards.reducer';
import { reducer as modelReducer, State as modelState } from '../features/flashcard/state/models.reducer';

export const stateFeatureKey = 'state';

export interface State {
  auth: authState,
  actors: actorState,
  flashcards: flashcardState,
  models: modelState
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  actors: actorReducer,
  flashcards: flashcardReducer,
  models: modelReducer,
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
