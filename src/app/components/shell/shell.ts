import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import { currentUsername } from '../../features/auth/state/session.selectors';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shell',
  imports: [RouterModule, NgIf, MatToolbarModule, MatButtonModule, AsyncPipe],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class Shell {
  protected baseUri: string = document.baseURI;
  private readonly store = inject(Store);
  protected readonly username$ = this.store.select(currentUsername);
}
