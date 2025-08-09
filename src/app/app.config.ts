import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { reducers } from './reducers';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  loginEffect,
  loginSuccessEffect,
} from './features/auth/state/login.effects';
import {
  addFlashcardToReviewEffect,
  createFlashcardEffect,
  createModelEffect,
  loadFlashcardEffect,
  loadFlashcardsPageEffect,
  loadModelEffect,
  loadModelsEffect,
  loadNextPageOnScrollEffect,
} from './features/flashcard/state/flashcards.effects';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { SrsService } from './features/flashcard/services/srs.service';
import { loadReviewScheduleEffect } from './features/dashboard/state';
import { loadRecentFlashcards$ } from './features/dashboard/state/recent-flashcards/recent-flashcards.effects';
import { loadKnowledgeGraphStats$ } from './features/dashboard/state/knowledge-graph-stats/knowledge-graph-stats.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    SrsService,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),
    provideStore(reducers),
    provideEffects({
      loginEffect,
      loginSuccessEffect,
      loadFlashcardsPageEffect,
      loadFlashcardEffect,
      loadModelEffect,
      loadModelsEffect,
      createModelEffect,
      createFlashcardEffect,
      addFlashcardToReviewEffect,
      loadReviewScheduleEffect,
      loadRecentFlashcards$,
      loadKnowledgeGraphStats$,
      loadNextPageOnScrollEffect,
    }),
    provideRouterStore(),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
};
