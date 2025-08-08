import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Flashcard } from '../state/flashcards.reducer';
import { Model } from '../state/models.reducer';
import { EduFlashcardModel } from '../state/model.interface';
import { FlashcardData } from '../components/flashcard/flashcard.component';

@Injectable({ providedIn: 'root' })
export class FlashcardService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  public getFlashcardsByUsername(username: string) {
    return this.http.get<any>(
      `${this.baseUrl}/actors/${username}/flashcards?perPage=25`
    );
  }

  public getFlashcardById(activityPubId: string) {
    return this.http.get<Flashcard>(activityPubId);
  }

  public getModelById(activityPubId: string) {
    return this.http.get<Model>(activityPubId);
  }

  public createModel(model: EduFlashcardModel) {
    return this.http.post<Model>(
      `${this.baseUrl}/edu/flashcard-models`,
      model
    );
  }

  /**
   * Sends the flashcard data to the API.
   * The payload will have the `eduModel` and `eduFieldsData` properties,
   * which is what the API is expecting according to the swagger definition.
   */
  public createFlashcard(flashcard: FlashcardData, username: string) {
    return this.http.post<Flashcard>(
      `${this.baseUrl}/edu/flashcards/${username}`,
      flashcard
    );
  }

  public getAllModels() {
    return this.http.get<Model[]>(`${this.baseUrl}/edu/flashcard-models`);
  }

  public addFlashcardToReview(flashcard: Flashcard) {
    console.log('addFlashToReview', flashcard);
    return this.http.post(`${this.baseUrl}/srs/review`, {
      flashcardActivityPubId: flashcard.id,
      rating: 1,
    });
  }
}
