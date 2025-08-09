import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SrsService {
  private readonly http = inject(HttpClient);

  getReviewSchedule(): Observable<any> {
    return this.http.get('/api/srs/schedule');
  }
}
