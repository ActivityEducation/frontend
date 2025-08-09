import { createReducer, on } from '@ngrx/store';
import * as KnowledgeGraphStatsActions from './knowledge-graph-stats.actions';

export interface State {
  stats: any;
  error: any;
  loading: boolean;
}

export const initialState: State = {
  stats: null,
  error: null,
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(KnowledgeGraphStatsActions.loadKnowledgeGraphStats, (state) => ({ ...state, loading: true })),
  on(KnowledgeGraphStatsActions.loadKnowledgeGraphStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    loading: false,
  })),
  on(KnowledgeGraphStatsActions.loadKnowledgeGraphStatsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
