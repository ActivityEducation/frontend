import { createReducer, on } from '@ngrx/store';
import { ActorActions } from './actor.actions';
import { Actor } from '../actor.interface';

export const profileFeatureKey = 'profile';

export interface State {
  error: any;
  current: Actor | null;
}

export const initialState: State = {
  current: null,
  error: null,
};

export const reducer = createReducer(
  initialState,
  on(ActorActions.loadActorProfileFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
