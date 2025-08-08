import { createFeatureSelector, createSelector } from '@ngrx/store';
import { adapter, State as FeatureState } from './models.reducer';

export const modelsFeatureKey = 'models';

export const modelFeature =
  createFeatureSelector<FeatureState>(modelsFeatureKey);

const entitySelectors = adapter.getSelectors();

export const models = createSelector(
  modelFeature,
  entitySelectors.selectEntities
);

export const allModels = createSelector(
  models,
  (models) => Object.values(models),
);

export const modelById = (activityPubId: string) => createSelector(
  modelFeature,
  (state: FeatureState) => state?.entities?.[activityPubId] ?? null
);
