import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Flashcard } from './flashcards.reducer';
import { Model } from './models.reducer';
import { EduFlashcardModel } from './model.interface';
import { FlashcardData } from '../components/flashcard/flashcard.component';

export const FlashcardsActions = createActionGroup({
  source: 'Flashcards',
  events: {
    'Load Flashcards Page': props<{ page: number, limit: number }>(),
    'Load Flashcards Page Success': props<{ flashcards: Flashcard[], totalCount: number, page: number, limit: number }>(),
    'Load Flashcards Page Failure': props<{ error: unknown }>(),
    'Load More Flashcards': props<{ page: number, limit: number }>(),
    'Load More Flashcards Success': props<{ flashcards: Flashcard[], totalCount: number, page: number, limit: number }>(),
    'Load Flashcard': props<{ activityPubId: string }>(),
    'Add To Review': props<{ flashcard: Flashcard }>(),
    'Load Flashcard Success': props<{ data: Flashcard }>(),
    'Create Flashcard': props<{ flashcard: FlashcardData }>(),
    'Load Flashcard Failure': props<{ error: unknown }>(),
    'Load Model': props<{ activityPubId: string }>(),
    'Load Models': emptyProps(),
    'Load Models Success': props<{ data: Model[] }>(),
    'Create Model': props<{ model: EduFlashcardModel }>(),
    'Load Model Success': props<{ data: Model }>(),
    'Load Model Failure': props<{ error: unknown }>(),
    'Change Page': props<{ page: number }>(),
    'Change Items Per Page': props<{ itemsPerPage: number }>(),
    'Next Page': emptyProps(),
    'Previous Page': emptyProps(),
    'Toggle Model Filter': props<{ modelIds: string[] }>(),
    'Set Loading Status': props<{ loading: boolean }>(),
    'Set All Flashcards Loaded': props<{ loaded: boolean }>(),
    'Scroll Reached Bottom': emptyProps(),
  }
});
