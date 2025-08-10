import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule, JsonPipe } from '@angular/common';
import { FlipperComponent } from '../../../../components/flipper/flipper.component';
import { DynamicTextFieldComponent } from '../../../../components/dynamic-text-field/dynamic-text-field.component';
import { Model } from '../../state/models.reducer';
import { Flashcard } from '../../state/flashcards.reducer';
import { MatIconModule } from '@angular/material/icon';

// --- Type Definitions ---

export interface EduFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'icon';
}

export interface EduFieldLayout {
  fieldId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EduCardTemplate {
  id: string;
  name: string;
  layout: EduFieldLayout[];
}

export interface FlashcardModel {
    id: string;
    activityPubId?: string;
    name: string;
    summary?: string;
    fields: EduFieldDefinition[];
    cardTemplates: EduCardTemplate[];
}

export interface FlashcardData {
    name: string;
    eduModel: string;
    eduFieldsData: Record<string, any>;
}

// --- Constants for Scaling ---
const DESIGN_WIDTH = 656;
const DESIGN_HEIGHT = 400;

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [CommonModule, FlipperComponent, DynamicTextFieldComponent, MatIconModule],
  templateUrl: './flashcard.component.html',
  styleUrls: ['./flashcard.component.scss']
})
export class FlashcardComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() model!: Model | FlashcardModel;
  @Input() data!: Flashcard | FlashcardData | null;
  @Input() isFlipped?: boolean;
  @Output() flipChange = new EventEmitter<boolean>();

  @ViewChild('flashcardWrapper') private wrapperRef!: ElementRef<HTMLDivElement>;

  public scale = 1;
  public frontTemplate?: EduCardTemplate;
  public backTemplate?: EduCardTemplate;

  private resizeObserver!: ResizeObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['model'] && this.model) {
      const cardTemplates = 'cardTemplates' in this.model ? this.model.cardTemplates : this.model['edu:cardTemplates'];
      this.frontTemplate = cardTemplates.find(t => t.id === 'front' || t.name === 'Front');
      this.backTemplate = cardTemplates.find(t => t.id === 'back' || t.name === 'Back');
    }
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        this.updateScale(entry.contentRect);
      }
    });

    if (this.wrapperRef?.nativeElement) {
      this.resizeObserver.observe(this.wrapperRef.nativeElement);
    }
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  private updateScale(rect: DOMRectReadOnly): void {
    this.scale = rect.width / DESIGN_WIDTH;
    this.wrapperRef.nativeElement.style.height = `${this.scale * DESIGN_HEIGHT}px`;
    this.cdr.detectChanges();
  }

  getFieldDefinition(fieldId: string): EduFieldDefinition | undefined {
    if (!this.model) return undefined;
    const fields = 'fields' in this.model ? this.model.fields : this.model['edu:fields'];
    return fields.find((f: any) => f.id === fieldId);
  }

  getFieldContent(fieldDef?: EduFieldDefinition): any {
    if (!fieldDef || !this.data) return null;
    const fieldsData = 'eduFieldsData' in this.data ? this.data.eduFieldsData : this.data['edu:fieldsData'];
    return fieldsData[fieldDef.id];
  }
}
