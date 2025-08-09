import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as KnowledgeGraphStatsActions from './knowledge-graph-stats.actions';
import { KnowledgeGraphService } from '../../services/knowledge-graph.service';

export const loadKnowledgeGraphStats$ = createEffect(
  (actions$ = inject(Actions), knowledgeGraphService = inject(KnowledgeGraphService)) => {
    return actions$.pipe(
      ofType(KnowledgeGraphStatsActions.loadKnowledgeGraphStats),
      mergeMap(() =>
        knowledgeGraphService.getGraph().pipe(
          map((stats) => KnowledgeGraphStatsActions.loadKnowledgeGraphStatsSuccess({ stats })),
          catchError((error) => of(KnowledgeGraphStatsActions.loadKnowledgeGraphStatsFailure({ error })))
        )
      )
    );
  },
  { functional: true }
);
