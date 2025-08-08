import {
  ApplicationConfig,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
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
  initFlashcardsEffect,
  loadFlashcardEffect,
  loadFlashcardsEffect,
  loadModelEffect,
  loadModelsEffect,
} from './features/flashcard/state/flashcards.effects';
import { authInterceptor } from './features/auth/interceptors/auth.interceptor';
import { SrsService } from './features/flashcard/services/srs.service';

export const appConfig: ApplicationConfig = {
  providers: [
    SrsService,
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideStore(reducers),
    provideEffects({
      loginEffect,
      loginSuccessEffect,
      initFlashcardsEffect,
      loadFlashcardsEffect,
      loadFlashcardEffect,
      loadModelEffect,
      loadModelsEffect,
      createModelEffect,
      createFlashcardEffect,
      addFlashcardToReviewEffect,
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
