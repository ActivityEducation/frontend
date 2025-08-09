import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewScheduleWidgetComponent } from './components/review-schedule-widget/review-schedule-widget.component';
import { RecentFlashcardsWidgetComponent } from './components/recent-flashcards-widget/recent-flashcards-widget.component';
import { FlashcardModelsWidgetComponent } from './components/flashcard-models-widget/flashcard-models-widget.component';
import { KnowledgeGraphStatsWidgetComponent } from './components/knowledge-graph-stats-widget/knowledge-graph-stats-widget.component';
import { DueFlashcardsCountWidgetComponent } from './components/due-flashcards-count-widget/due-flashcards-count-widget.component';
import { MatCardModule } from '@angular/material/card';
import { CdkDragDrop, moveItemInArray, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  imports: [
    MatCardModule,
    DragDropModule,
    CommonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  public widgets: { id: string; component: any; title: string }[] = [
    { id: 'review-schedule', component: ReviewScheduleWidgetComponent, title: 'Upcoming Reviews' },
    { id: 'recent-flashcards', component: RecentFlashcardsWidgetComponent, title: 'Recent Flashcards' },
    { id: 'flashcard-models', component: FlashcardModelsWidgetComponent, title: 'Flashcard Models' },
    { id: 'knowledge-graph-stats', component: KnowledgeGraphStatsWidgetComponent, title: 'Knowledge Graph Stats' },
    { id: 'due-flashcards-count', component: DueFlashcardsCountWidgetComponent, title: 'Due Flashcards' },
  ];

  ngOnInit(): void {
    this.loadWidgetOrder();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
    this.saveWidgetOrder();
  }

  private saveWidgetOrder() {
    const order = this.widgets.map(widget => widget.id);
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(order));
  }

  private loadWidgetOrder() {
    const savedOrder = localStorage.getItem('dashboardWidgetOrder');
    if (savedOrder) {
      const order: string[] = JSON.parse(savedOrder);
      const reorderedWidgets = order.map(id => this.widgets.find(widget => widget.id === id)).filter((widget): widget is { id: string; component: any; title: string } => !!widget);
      // Ensure all original widgets are present, even if not in savedOrder
      const remainingWidgets = this.widgets.filter(widget => !order.includes(widget.id));
      this.widgets = [...reorderedWidgets, ...remainingWidgets] as { id: string; component: any; title: string }[];
    }
  }
}
