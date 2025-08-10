import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule, AsyncPipe, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FlashcardComponent, FlashcardData, FlashcardModel } from '../flashcard/flashcard.component';
import { allModels } from '../../state/models.selectors';
import { FlashcardsActions } from '../../state/flashcards.actions';

@Component({
  selector: 'app-flashcard-creator',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FlashcardComponent,
    MatListModule,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './flashcard-creator.component.html',
  styleUrls: ['./flashcard-creator.component.scss']
})
export class FlashcardCreatorComponent {
  @Output() save = new EventEmitter<FlashcardData>();

  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  public models$: Observable<any[]> = this.store.select(allModels);
  public selectedModel: FlashcardModel | null = null;

  form!: FormGroup;
  flashcardData: FlashcardData | null = null;

  ngOnInit() {
    this.store.dispatch(FlashcardsActions.loadModels());
  }

  handleModelSelection(model: FlashcardModel): void {
    this.selectedModel = model;
    this.buildForm();
    this.updatePreview();
  }

  private buildForm(): void {
    if (!this.selectedModel) return;

    const fields = this.selectedModel.fields.reduce((acc, field) => {
      acc[field.id] = ['', Validators.required];
      return acc;
    }, {} as { [key: string]: any });

    this.form = this.fb.group({
      name: ['', Validators.required],
      ...fields
    });

    this.form.valueChanges.subscribe(() => {
      this.updatePreview();
    });
  }

  private updatePreview(): void {
    if (!this.selectedModel || !this.form) return;

    const formValues = this.form.getRawValue();
    const fieldsData: Record<string, any> = {};

    this.selectedModel.fields.forEach(field => {
      fieldsData[field.id] = formValues[field.id];
    });

    this.flashcardData = {
      name: formValues.name,
      eduModel: this.selectedModel.activityPubId!,
      eduFieldsData: fieldsData,
    };
  }

  handleSave(): void {
    if (this.form.valid) {
      this.store.dispatch(FlashcardsActions.createFlashcard({
          flashcard: this.flashcardData!
      }));
    }
  }
}