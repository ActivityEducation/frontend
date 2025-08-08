import { createActionGroup, props } from '@ngrx/store';
import { JwtPayload } from '../jwt.interface';

export const LoginActions = createActionGroup({
  source: 'Login',
  events: {
    'Create Session': props<{ username: string; password: string }>(),
    'Login Success': props<{ data: { access_token: string } }>(),
    'Login Failure': props<{ error: unknown }>(),
    'Set Current User': props<{ jwt: JwtPayload }>(),
  },
});
