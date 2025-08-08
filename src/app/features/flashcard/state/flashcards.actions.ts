import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Flashcard } from './flashcards.reducer';
import { Model } from './models.reducer';
import { EduFlashcardModel } from './model.interface';
import { FlashcardData } from '../components/flashcard/flashcard.component';

export const FlashcardsActions = createActionGroup({
  source: 'Flashcards',
  events: {
    'Load Flashcards': props<{ username: string }>(),
    'Load Flashcard': props<{ activityPubId: string }>(),
    'Add To Review': props<{ flashcard: Flashcard }>(),
    'Load Flashcard Success': props<{ data: Flashcard }>(),
    'Create Flashcard': props<{ flashcard: FlashcardData, username: string }>(),
    'Load Flashcard Failure': props<{ error: unknown }>(),
    'Load Model': props<{ activityPubId: string }>(),
    'Load Models': emptyProps(),
    'Create Model': props<{ model: EduFlashcardModel }>(),
    'Load Model Success': props<{ data: Model }>(),
    'Load Model Failure': props<{ error: unknown }>(),
  }
});
