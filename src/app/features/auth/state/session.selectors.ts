import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './auth.reducer';

export const SessionSelect = createFeatureSelector<State>('auth');

export const currentUsername = createSelector(SessionSelect, (state: State) => state.current?.username);
export const accessToken = createSelector(SessionSelect, (state: State) => state.access_token);