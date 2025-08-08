import { Component, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { LoginActions } from './state/login.actions';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);

  public form = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false],
  });

  protected onSumbit(): void {
    if (this.form.valid) {
      this.login(this.form.value.username!, this.form.value.password!);
    }
  }

  public login(username: string, password: string): void {
    this.store.dispatch(LoginActions.createSession({ username, password }));
  }
}
