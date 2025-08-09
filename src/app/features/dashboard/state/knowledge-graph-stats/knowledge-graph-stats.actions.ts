import { createAction, props } from '@ngrx/store';

export const loadKnowledgeGraphStats = createAction('[Knowledge Graph Stats] Load Knowledge Graph Stats');

export const loadKnowledgeGraphStatsSuccess = createAction(
  '[Knowledge Graph Stats] Load Knowledge Graph Stats Success',
  props<{ stats: any }>()
);

export const loadKnowledgeGraphStatsFailure = createAction(
  '[Knowledge Graph Stats] Load Knowledge Graph Stats Failure',
  props<{ error: any }>()
);
