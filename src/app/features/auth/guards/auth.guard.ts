import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { accessToken } from '../state/session.selectors';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(accessToken).pipe(
    take(1),
    map((user) => !!user || router.createUrlTree(['/', 'auth']))
  );
};
