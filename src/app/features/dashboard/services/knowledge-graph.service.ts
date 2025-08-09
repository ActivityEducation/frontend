import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class KnowledgeGraphService {
  private readonly http = inject(HttpClient);

  getGraph(): Observable<any> {
    return this.http.get('/api/knowledge-graph/graph');
  }
}
