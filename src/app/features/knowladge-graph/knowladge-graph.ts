import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { currentUsername } from '../auth/state/session.selectors';
import { KnowledgeGraphComponent } from '../../components/knowladge-graph/knowladge-graph.component';

@Component({
  selector: 'app-dashboard',
  imports: [KnowledgeGraphComponent],
  templateUrl: './knowladge-graph.html',
  styleUrl: './knowladge-graph.scss',
})
export class KnowladgeGraph {
  private readonly store = inject(Store);
}
