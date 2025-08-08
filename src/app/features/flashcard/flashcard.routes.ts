import { Routes } from '@angular/router';
import { FlashcardModelEditorComponent } from './components/flashcard-model-editor/flashcard-model-editor.component';
import { FlashcardCollectionComponent } from './components/flashcard-collection/flashcard-collection.component';
import { FlashcardCreatorComponent } from './components/flashcard-creator/flashcard-creator.component';
import { SrsService } from './services/srs.service';
import { ReviewSessionPageComponent } from './components/review-session/review-session.component';

export const routes: Routes = [
  {
    path: '',
    component: FlashcardCollectionComponent,
  },
  {
    path: 'create',
    component: FlashcardCreatorComponent,
  },
  {
    path: 'create-model',
    component: FlashcardModelEditorComponent,
  },
  {
    path: 'review',
    component: ReviewSessionPageComponent,
    // The service is provided at the route level, making it available
    // for injection into the ReviewSessionPageComponent.
    providers: [SrsService],
  },
];
