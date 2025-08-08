import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable } from 'rxjs';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { BehaviorSubject } from 'rxjs';
import { allModels } from '../../state/models.selectors';
import { combinedFlashcard } from '../../state/flashcards.selectors';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlashcardsActions } from '../../state/flashcards.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AccordionComponent } from "../../../../components/accordion/accordion.component";
import { MatToolbarModule } from '@angular/material/toolbar';
import { CarouselComponent } from '../../../../components/carousel/carousel.component';
import { Flashcard } from '../../state/flashcards.reducer';

type ViewMode = 'grid' | 'list' | 'single';
type SortOption = 'name-asc' | 'name-desc' | 'createdAt-asc' | 'createdAt-desc';

@Component({
  selector: 'app-flashcard-collection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlashcardComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatToolbarModule,
    RouterLink,
    MatIconModule,
    MatListModule,
    AccordionComponent,
],
  templateUrl: './flashcard-collection.component.html',
  styleUrls: ['./flashcard-collection.component.scss'],
})
export class FlashcardCollectionComponent {
  // --- UI State Observables ---
  public viewMode$ = new BehaviorSubject<ViewMode>('grid');
  public selectedSort$ = new BehaviorSubject<SortOption>('name-asc');
  public selectedModelIds$ = new BehaviorSubject<Record<string, boolean>>({});

  private readonly store = inject(Store);

  protected showHeaders: boolean = false;

  public toggleHeaders() {
    this.showHeaders = !this.showHeaders;
  }

  public addToReview(flashcard: Flashcard) {
    this.store.dispatch(FlashcardsActions.addToReview({ flashcard }));
  }

  // --- Data from Store ---
  public models$: Observable<any[]> = this.store.select(allModels);
  public displayedCards$: Observable<any[]> = combineLatest([
    this.store.select(combinedFlashcard),
    this.selectedModelIds$,
  ]).pipe(
    map(([flashcards, selectedModelIds]) => {
      let filteredFlashcards = flashcards;

      if (selectedModelIds && Object.keys(selectedModelIds).length > 0) {
        filteredFlashcards = filteredFlashcards.filter((flashcard) => {
          return (
            flashcard.model.id in selectedModelIds &&
            selectedModelIds[flashcard.model.id]
          );
        });
      }

      return filteredFlashcards;
    })
  );

  ngOnInit() {
    this.store.dispatch(FlashcardsActions.loadModels());
  }

  toggleViewMode(mode: ViewMode): void {
    this.viewMode$.next(mode);
  }

  onSortChange(event: Event): void {
    this.selectedSort$.next(
      (event.target as HTMLSelectElement).value as SortOption
    );
  }

  public onModelFilterChange(isChecked: boolean, modelId: string): void {
    const currentFilters = {...this.selectedModelIds$.value};
    if (!isChecked) delete currentFilters[modelId];
    else currentFilters[modelId] = true;
    
    this.selectedModelIds$.next(currentFilters);
  }
}
