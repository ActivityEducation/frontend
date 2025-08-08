import { createReducer, on } from '@ngrx/store';
import { LoginActions } from './login.actions';
import { JwtPayload } from '../jwt.interface';

export const authFeatureKey = 'auth';

export interface State {
  access_token: string | null;
  current: JwtPayload | null;
}

export const initialState: State = {
  access_token: null,
  current: null,
};

export const reducer = createReducer(
  initialState,
  on(LoginActions.setCurrentUser, (state, { jwt }) => ({
    ...state,
    current: jwt,
  })),
  on(LoginActions.loginSuccess, (state, { data }) => ({
    ...state,
    access_token: data.access_token,
  }))
);
