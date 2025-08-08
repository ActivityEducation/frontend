import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/shell/shell').then((m) => m.Shell),
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.routes),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.routes),
      },
      {
        path: 'graph',
        // canActivate: [authGuard],
        loadChildren: () =>
          import('./features/knowladge-graph/knowladge-graph.routes').then((m) => m.routes),
      },
      {
        path: 'flashcard',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./features/flashcard/flashcard.routes').then((m) => m.routes),
      },
      {
        path: '**',
        redirectTo: 'auth',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
];
