import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoginActions } from './login.actions';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwt.interface';

export const loginEffect = createEffect(
  (actions$ = inject(Actions), authService = inject(AuthService)) => {
    return actions$.pipe(
      ofType(LoginActions.createSession),
      exhaustMap(({ username, password }) => {
        return authService.login(username, password).pipe(
          map((data) => LoginActions.loginSuccess({ data })),
          catchError((error) => of(LoginActions.loginFailure({ error })))
        );
      })
    );
  },
  { functional: true }
);

export const loginSuccessEffect = createEffect(
  (
    actions$ = inject(Actions),
    router = inject(Router),
    store = inject(Store)
  ) => {
    return actions$.pipe(
      ofType(LoginActions.loginSuccess),
      map(
        ({ data: { access_token: accessToken } }) =>
          jwtDecode(accessToken) as JwtPayload
      ),
      switchMap((jwt: JwtPayload) => {
        return [LoginActions.setCurrentUser({ jwt })];
      }),
      tap(() => router.navigate(['/', 'dashboard']))
    );
  },
  { functional: true, dispatch: true }
);
