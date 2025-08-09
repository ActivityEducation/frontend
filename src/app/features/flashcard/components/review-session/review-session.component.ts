/*
* =================================================================
*
* ## ⚙️ Review Session Page Component (Logic)
*
* This is the standalone page component for the review session. It
* imports and uses your actual `FlashcardComponent` and Angular
* Material components.
*
* **File:** src/app/features/review-session/pages/review-session-page/review-session-page.component.ts
*
* =================================================================
*/
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SrsService } from '../../services/srs.service';
import { DueFlashcard } from '../../models/flashcard.model';

// --- Real Component Imports ---
import { ReviewControlsComponent } from '../../components/review-controls/review-controls.component';
import { FlashcardComponent } from '../../../flashcard/components/flashcard/flashcard.component';

// --- Angular Material Imports ---
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-review-session-page',
  standalone: true,
  imports: [
    CommonModule,
    // Real components from your library
    FlashcardComponent,
    ReviewControlsComponent,
    // Angular Material modules for UI
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  templateUrl: './review-session.component.html',
  styleUrls: ['./review-session.component.scss']
})
export class ReviewSessionPageComponent implements OnInit {
  // --- State Management ---
  isLoading = true;
  isSessionComplete = false;
  isAnswerVisible = false;

  dueCards: DueFlashcard[] = [];
  currentCardIndex = 0;
  totalCards = 0;

  constructor(
    private srsService: SrsService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchDueCards();
  }

  fetchDueCards(): void {
    this.isLoading = true;
    // For now, we still use the mock service to get due cards.
    // This would be replaced with a call to the real GET /api/srs/due endpoint.
    this.srsService.getDueFlashcards().subscribe({
      next: (cards) => {
        this.dueCards = cards;
        this.totalCards = cards.length;
        this.isLoading = false; // Stop spinner on success
        this.cdr.detectChanges(); // Manually trigger change detection
      },
      error: (err) => {
        console.error('Failed to fetch due cards:', err);
        this.isLoading = false; // Stop spinner on error
        this.cdr.detectChanges(); // Also trigger change detection on error
      }
    });
  }

  get currentCard(): DueFlashcard | null {
    return this.dueCards.length > 0 ? this.dueCards[this.currentCardIndex] : null;
  }

  get progressPercentage(): number {
    if (this.totalCards === 0) return 0;
    return ((this.currentCardIndex) / this.totalCards) * 100;
  }

  showAnswer(): void {
    this.isAnswerVisible = true;
  }

  submitRating(rating: number): void {
    if (!this.currentCard?.data.activityPubId) {
        console.error("Cannot submit review: flashcardActivityPubId is missing.");
        return;
    };

    // The service now needs the full ActivityPub ID.
    const flashcardActivityPubId = this.currentCard.data.activityPubId;

    this.srsService.submitReview({ flashcardActivityPubId, rating }).subscribe({
        next: (response) => {
            this.advanceToNextCard();
        },
        error: (err) => {
            console.error('Failed to submit review:', err);
            // Still advance to the next card so the user is not stuck,
            // but you might want to add specific error handling here.
            this.advanceToNextCard();
        }
    });
  }

  private advanceToNextCard(): void {
    if (this.currentCardIndex < this.totalCards - 1) {
      this.currentCardIndex++;
      this.isAnswerVisible = false; // Reset flip state for the next card
    } else {
      this.isSessionComplete = true;
    }
    this.cdr.detectChanges(); // Ensure UI updates after advancing
  }

  restartSession(): void {
    this.isLoading = true;
    this.isSessionComplete = false;
    this.currentCardIndex = 0;
    this.isAnswerVisible = false;
    this.fetchDueCards();
  }
}
