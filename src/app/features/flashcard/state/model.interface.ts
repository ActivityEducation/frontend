import { EduFieldDefinition } from "../models/flashcard.model";

export interface EduFieldLayout {
  fieldId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EduCardTemplate {
  id: string;
  name: 'Front' | 'Back';
  layout: EduFieldLayout[];
}

export interface EduFlashcardModel {
  id?: string;
  name: string;
  summary?: string;
  fields: EduFieldDefinition[];
  cardTemplates: EduCardTemplate[];
}