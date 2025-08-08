// --- Core Flashcard and Model Interfaces ---

export interface EduFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'icon';
}

export interface EduFieldLayout {
  fieldId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EduCardTemplate {
  id: string;
  name: string;
  layout: EduFieldLayout[];
}

export interface FlashcardModel {
    id: string;
    name: string;
    summary?: string;
    'edu:fields': EduFieldDefinition[];
    'edu:cardTemplates': EduCardTemplate[];
}

export interface Flashcard {
    id: string;
    name: string;
    'edu:model': string;
    'edu:fieldsData': Record<string, any>;
}

// --- Review Session Interfaces ---

export type ReviewRating = 1 | 2 | 3 | 4;

export interface DueFlashcard {
    flashcard: Flashcard;
    model: FlashcardModel;
}

export interface SubmitReviewPayload {
    flashcardId: string;
    rating: ReviewRating;
}
