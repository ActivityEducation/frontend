/*
* =================================================================
*
* ## 🧠 Spaced Repetition Service (Real)
*
* This service now uses Angular's HttpClient to communicate with the
* backend API for both getting due cards and submitting reviews.
*
* **File:** src/app/features/review-session/services/srs.service.ts
*
* =================================================================
*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DueFlashcard } from '../models/flashcard.model';
import { SubmitReview } from '../models/review.model';

@Injectable()
export class SrsService {

  private apiUrl = '/api/srs'; // Base URL for the SRS endpoints

  constructor(private http: HttpClient) { }

  /**
   * Submits a review for a single flashcard to the real backend endpoint.
   * Corresponds to: POST /api/srs/review
   * @param review - The review data containing flashcardActivityPubId and rating.
   * @returns An Observable with the updated SpacedRepetitionScheduleEntity.
   */
  submitReview(review: SubmitReview): Observable<any> {
    console.log(`SERVICE: Submitting review for flashcard ${review.flashcardActivityPubId} with rating ${review.rating}`);
    return this.http.post<any>(`${this.apiUrl}/review`, review);
  }

  addToReview(review: Omit<SubmitReview, 'rating'>): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, review);
  }

  /**
   * Fetches all flashcards due for review from the real backend endpoint.
   * Corresponds to: GET /api/srs/due
   * @returns An Observable array of DueFlashcard objects.
   */
  getDueFlashcards(): Observable<DueFlashcard[]> {
    console.log('SERVICE: Fetching due flashcards from API...');
    // This now makes a real HTTP call to the backend.
    // Note: This assumes the backend returns data in the `DueFlashcard[]` shape.
    // If the shape is different, a `map` operator would be needed to transform the data.
    return this.http.get<DueFlashcard[]>(`${this.apiUrl}/due`);
  }
}
