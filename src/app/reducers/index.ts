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
import { reducer as reviewScheduleReducer, State as reviewScheduleState } from '../features/dashboard/state/review-schedule.reducer';
import { reducer as recentFlashcardsReducer, State as recentFlashcardsState } from '../features/dashboard/state/recent-flashcards/recent-flashcards.reducer';
import { reducer as knowledgeGraphStatsReducer, State as knowledgeGraphStatsState } from '../features/dashboard/state/knowledge-graph-stats/knowledge-graph-stats.reducer';

export const stateFeatureKey = 'state';

export interface State {
  auth: authState,
  actors: actorState,
  flashcards: flashcardState,
  models: modelState,
  reviewSchedule: reviewScheduleState,
  recentFlashcards: recentFlashcardsState,
  knowledgeGraphStats: knowledgeGraphStatsState,
}

export const reducers: ActionReducerMap<State> = {
  auth: authReducer,
  actors: actorReducer,
  flashcards: flashcardReducer,
  models: modelReducer,
  reviewSchedule: reviewScheduleReducer,
  recentFlashcards: recentFlashcardsReducer,
  knowledgeGraphStats: knowledgeGraphStatsReducer,
};


export const metaReducers: MetaReducer<State>[] = isDevMode() ? [] : [];
