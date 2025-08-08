// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SrsService } from '../../services/srs.service';
// import { DueFlashcard, ReviewRating } from '../../types/srs.types';
// import { FlashcardComponent } from '../flashcard/flashcard.component';
// import { ReviewControlsComponent } from '../review-controls/review-controls.component';

// // --- Type Definitions ---
// export type SessionStatus = 'loading' | 'reviewing' | 'submitting' | 'complete' | 'empty' | 'error';

// @Component({
//   selector: 'app-review-session',
//   standalone: true,
//   imports: [CommonModule, FlashcardComponent, ReviewControlsComponent],
//   templateUrl: './review-session.component.html',
//   styleUrls: ['./review-session.component.scss']
// })
// export class ReviewSessionComponent implements OnInit {
//   public status: SessionStatus = 'loading';
//   public dueCards: DueFlashcard[] = [];
//   public currentIndex = 0;
//   public isFlipped = false;
//   public error: string | null = null;

//   constructor(private srsService: SrsService, private cdr: ChangeDetectorRef) {}

//   ngOnInit(): void {
//     this.fetchCards();
//   }

//   fetchCards(): void {
//     this.status = 'loading';
//     this.srsService.getDueFlashcards().subscribe({
//       next: (cards) => {
//         if (cards.length > 0) {
//           this.dueCards = cards;
//           this.status = 'reviewing';
//         } else {
//           this.status = 'empty';
//         }
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         this.error = 'Could not load review session. Please try again later.';
//         this.status = 'error';
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   handleRate(rating: ReviewRating): void {
//     const currentCard = this.dueCards[this.currentIndex];
//     if (!currentCard || this.status === 'submitting') return;

//     this.status = 'submitting';
//     this.srsService.submitReview({
//       flashcardId: currentCard.flashcard.id,
//       rating,
//     }).subscribe({
//       next: () => {
//         if (this.currentIndex < this.dueCards.length - 1) {
//           this.currentIndex++;
//           this.isFlipped = false;
//           this.status = 'reviewing';
//         } else {
//           this.status = 'complete';
//         }
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         this.error = 'Failed to save review. Please try again.';
//         this.status = 'error';
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   get progress(): number {
//     if (this.dueCards.length === 0) return 0;
//     return (this.currentIndex / this.dueCards.length) * 100;
//   }

//   get currentCard(): DueFlashcard | undefined {
//     return this.dueCards[this.currentIndex];
//   }
// }
