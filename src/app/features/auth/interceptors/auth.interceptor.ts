import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { accessToken } from '../state/session.selectors';
import { map, mergeMap, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return store.select(accessToken).pipe(
    take(1),
    mergeMap((token) =>
      next(
        req.clone({
          setHeaders: token ? {
            Authorization: `Bearer ${token}`,
          } : {},
        })
      )
    )
  );
};
