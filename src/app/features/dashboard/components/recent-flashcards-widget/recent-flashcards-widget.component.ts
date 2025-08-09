import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadRecentFlashcards, selectRecentFlashcards, selectRecentFlashcardsLoading } from '../../state/recent-flashcards';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recent-flashcards-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-flashcards-widget.component.html',
  styleUrls: ['./recent-flashcards-widget.component.scss'],
})
export class RecentFlashcardsWidgetComponent implements OnInit {
  private readonly store = inject(Store);

  public flashcards$: Observable<any[]> = this.store.select(selectRecentFlashcards);
  public loading$: Observable<boolean> = this.store.select(selectRecentFlashcardsLoading);

  ngOnInit(): void {
    this.store.dispatch(loadRecentFlashcards());
  }
}
