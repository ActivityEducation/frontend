/*
* =================================================================
*
* ## 🃏 Data Models
*
* The data models are updated to include the `activityPubId`.
*
* **File:** src/app/features/review-session/models/flashcard.model.ts
*
* =================================================================
*/
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
    activityPubId?: string;
    name: string;
    summary?: string;
    fields: EduFieldDefinition[];
    cardTemplates: EduCardTemplate[];
}

export interface FlashcardData {
    id: string; // Internal UUID
    activityPubId: string; // The full URI for the API
    name: string;
    eduModel: string;
    eduFieldsData: Record<string, any>;
}

export interface DueFlashcard {
  model: FlashcardModel;
  data: FlashcardData;
}