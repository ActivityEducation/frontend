import { createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { FlashcardsActions } from './flashcards.actions';

export const flashcardsFeatureKey = 'flashcards';

export interface ModelField {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'icon';
}

export interface ModelLayout {
  fieldId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ModelTemplate {
  id: string;
  name: string;
  layout: ModelLayout[];
}

export interface Model {
  id: string;
  activityPubId: string;
  type: string | string[] | ['edu:FlashcardModel', 'Object'];
  name: string;
  summary: string;
  url: string;
  'edu:fields': ModelField[];
  'edu:cardTemplates': ModelTemplate[];
}

export interface State extends EntityState<Model> {}

export const adapter: EntityAdapter<Model> = createEntityAdapter<Model>({
    selectId: (model) => model.activityPubId || model.id,
  });

export const initialState: State = {
  ids: [],
  entities: {},
};

export const reducer = createReducer(
  initialState,
  on(FlashcardsActions.loadModelSuccess, (state, { data: model }) =>
    adapter.upsertOne(model, state)
  ),
  on(FlashcardsActions.loadModelsSuccess, (state, { data: models }) =>
    adapter.setAll(models, state)
  )
);