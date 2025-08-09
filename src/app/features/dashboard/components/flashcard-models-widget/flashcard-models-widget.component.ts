import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { allModels } from '../../../flashcard/state/models.selectors';
import { FlashcardsActions } from '../../../flashcard/state/flashcards.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-flashcard-models-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flashcard-models-widget.component.html',
  styleUrls: ['./flashcard-models-widget.component.scss'],
})
export class FlashcardModelsWidgetComponent implements OnInit {
  private readonly store = inject(Store);

  public models$: Observable<any[]> = this.store.select(allModels);

  ngOnInit(): void {
    this.store.dispatch(FlashcardsActions.loadModels());
  }
}
