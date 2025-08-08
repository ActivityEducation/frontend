/*
* =================================================================
*
* ## 📊 Review Data Model
*
* This now uses `flashcardActivityPubId` to match the Swagger spec.
*
* **File:** src/app/features/review-session/models/review.model.ts
*
* =================================================================
*/

export interface SubmitReview {
  flashcardActivityPubId: string;
  rating: number; // 1: Again, 2: Hard, 3: Good, 4: Easy
}
