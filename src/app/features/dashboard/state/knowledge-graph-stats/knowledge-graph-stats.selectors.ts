import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromKnowledgeGraphStats from './knowledge-graph-stats.reducer';

export const selectKnowledgeGraphStatsState = createFeatureSelector<fromKnowledgeGraphStats.State>(
  'knowledgeGraphStats'
);

export const selectKnowledgeGraphStats = createSelector(
  selectKnowledgeGraphStatsState,
  (state) => state.stats
);

export const selectKnowledgeGraphStatsLoading = createSelector(
  selectKnowledgeGraphStatsState,
  (state) => state.loading
);
