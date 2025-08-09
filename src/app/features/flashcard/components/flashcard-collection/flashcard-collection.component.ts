import {
  Component,
  inject,
  OnInit,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject } from 'rxjs';
import { FlashcardComponent } from '../flashcard/flashcard.component';
import { allModels } from '../../state/models.selectors';
import {
  selectFlashcardsWithModels,
  selectSelectedModelIds,
  selectFlashcardsLoading,
  selectAllFlashcardsLoaded,
  selectFlashcardsPage,
  selectFlashcardsLimit,
} from '../../state/flashcards.selectors';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { FlashcardsActions } from '../../state/flashcards.actions';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { AccordionComponent } from '../../../../components/accordion/accordion.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Flashcard } from '../../state/flashcards.reducer';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatSelectModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './flashcard-collection.component.html',
  styleUrls: ['./flashcard-collection.component.scss'],
})
export class FlashcardCollectionComponent implements OnInit {
  private readonly store = inject(Store);

  // --- UI State Observables ---
  public viewMode$ = new BehaviorSubject<ViewMode>('grid');
  public selectedSort$ = new BehaviorSubject<SortOption>('name-asc');
  public selectedModelIds$ = this.store.select(selectSelectedModelIds);
  public loading$ = this.store.select(selectFlashcardsLoading);
  public allFlashcardsLoaded$ = this.store.select(selectAllFlashcardsLoaded);
  public currentPage$ = this.store.select(selectFlashcardsPage);
  public currentLimit$ = this.store.select(selectFlashcardsLimit);

  protected showHeaders: boolean = false;

  public toggleHeaders() {
    this.showHeaders = !this.showHeaders;
  }

  public addToReview(flashcard: Flashcard) {
    this.store.dispatch(FlashcardsActions.addToReview({ flashcard }));
  }

  // --- Data from Store ---
  public models$: Observable<any[]> = this.store.select(allModels);
  public displayedCards$ = this.store.select(selectFlashcardsWithModels);

  ngOnInit() {
    this.store.dispatch(FlashcardsActions.loadModels());
    // Dispatch initial load with page and limit from store or default values
    this.store.dispatch(
      FlashcardsActions.loadFlashcardsPage({ page: 1, limit: 10 })
    );
  }

  onScroll(event: Event): void {
    const element = event.currentTarget as HTMLElement;

    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      this.store.dispatch(FlashcardsActions.scrollReachedBottom());
    }
  }

  toggleViewMode(mode: ViewMode): void {
    this.viewMode$.next(mode);
  }

  onSortChange(event: Event): void {
    this.selectedSort$.next(
      (event.target as HTMLSelectElement).value as SortOption
    );
  }

  public onModelFilterChange(event: MatSelectionListChange): void {
    this.store.dispatch(
      FlashcardsActions.toggleModelFilter({ modelIds: event.source._value ?? [] })
    );
  }
}
