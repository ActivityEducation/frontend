import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { loadKnowledgeGraphStats, selectKnowledgeGraphStats, selectKnowledgeGraphStatsLoading } from '../../state/knowledge-graph-stats';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-knowledge-graph-stats-widget',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-graph-stats-widget.component.html',
  styleUrls: ['./knowledge-graph-stats-widget.component.scss'],
})
export class KnowledgeGraphStatsWidgetComponent implements OnInit {
  private readonly store = inject(Store);

  public stats$: Observable<any> = this.store.select(selectKnowledgeGraphStats);
  public loading$: Observable<boolean> = this.store.select(selectKnowledgeGraphStatsLoading);

  ngOnInit(): void {
    this.store.dispatch(loadKnowledgeGraphStats());
  }
}
