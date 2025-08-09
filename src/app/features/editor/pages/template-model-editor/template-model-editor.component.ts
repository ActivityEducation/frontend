import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  EduFieldDefinition,
} from '../../../../components/field-definition-panel/field-definition-panel.component';
import { FieldDefinitionPanelComponent } from '../../../../components/field-definition-panel/field-definition-panel.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EduCardTemplate, EduFieldLayout, EduFlashcardModel } from '../../../flashcard/state/model.interface';
import { Store } from '@ngrx/store';
import { FlashcardsActions } from '../../../flashcard/state/flashcards.actions';
import { AccordionComponent } from '../../../../components/accordion/accordion.component';
import { AvailableFieldsComponent } from '../../../../components/available-fields/available-fields.component';
import { LayersPanelComponent } from '../../../../components/layers-panel/layers-panel.component';
import { FlipperComponent } from '../../../../components/flipper/flipper.component';

// --- Type Definitions ---

// --- Grid and Snap Configuration ---
const GRID_SIZE = 8;
const CANVAS_MARGIN = 8;
const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;

@Component({
  selector: 'app-template-model-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FieldDefinitionPanelComponent,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule,
    AccordionComponent,
    AvailableFieldsComponent,
    LayersPanelComponent,
    FlipperComponent,
  ],
  templateUrl: './template-model-editor.component.html',
  styleUrls: ['./template-model-editor.component.scss'],
})
export class TemplateModelEditorComponent {
  @Input() initialModelData?: EduFlashcardModel;
  @Input() readOnly = false;
  @Output() save = new EventEmitter<EduFlashcardModel>();

  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLDivElement>;

  private readonly store = inject(Store);

  public model: EduFlashcardModel = this.getInitialModel();
  public activeTemplate: 'Front' | 'Back' = 'Front';

  private actionState: {
    type: 'move' | 'resize' | null;
    fieldId: string | null;
    offsetX?: number;
    offsetY?: number;
  } = { type: null, fieldId: null };

  private liveLayoutItem: EduFieldLayout | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    this.model = this.initialModelData || this.getInitialModel();
  }

  getInitialModel(): EduFlashcardModel {
    return {
      name: '',
      summary: '',
      fields: [],
      cardTemplates: [
        { id: 'front', name: 'Front', layout: [] },
        { id: 'back', name: 'Back', layout: [] },
      ],
    };
  }

  get currentTemplate(): EduCardTemplate {
    return this.model.cardTemplates.find(
      (t) => t.name === this.activeTemplate
    )!;
  }

  get renderedLayoutItems(): EduFieldLayout[] {
    return this.currentTemplate.layout.filter(
      (item) => item.fieldId !== this.actionState.fieldId
    );
  }

  get liveLayoutItemForTemplate(): EduFieldLayout | null {
    return this.liveLayoutItem;
  }

  getFieldById(id: string): EduFieldDefinition | undefined {
    return this.model.fields.find((f) => f.id === id);
  }

  onFieldsChanged(fields: EduFieldDefinition[]): void {
    this.model.fields = fields;
  }

  onLayersChanged(newLayout: EduFieldLayout[]): void {
    this.updateTemplateLayout(newLayout);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (this.readOnly) return;
    const fieldId = event.dataTransfer?.getData('fieldId');
    if (
      !fieldId ||
      this.currentTemplate.layout.some((l) => l.fieldId === fieldId)
    )
      return;

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    const newLayout: EduFieldLayout = {
      fieldId,
      x: snapToGrid(Math.max(CANVAS_MARGIN, x - 75)),
      y: snapToGrid(Math.max(CANVAS_MARGIN, y - 25)),
      width: 160,
      height: 64,
    };
    this.updateTemplateLayout([...this.currentTemplate.layout, newLayout]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onMouseDown(
    event: MouseEvent,
    fieldId: string,
    actionType: 'move' | 'resize'
  ): void {
    if (this.readOnly || event.button !== 0) return;
    event.stopPropagation();

    const layoutItem = this.currentTemplate.layout.find(
      (l) => l.fieldId === fieldId
    );
    if (!layoutItem) return;

    this.liveLayoutItem = { ...layoutItem };

    const targetElement =
      actionType === 'resize'
        ? (event.currentTarget as HTMLElement).parentElement!
        : (event.currentTarget as HTMLElement);
    this.actionState = {
      type: actionType,
      fieldId: fieldId,
      offsetX: event.clientX - targetElement.getBoundingClientRect().left,
      offsetY: event.clientY - targetElement.getBoundingClientRect().top,
    };
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (
      this.readOnly ||
      !this.actionState.type ||
      !this.actionState.fieldId ||
      !this.liveLayoutItem
    )
      return;
    event.preventDefault();

    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();

    if (this.actionState.type === 'move') {
      let newX = event.clientX - canvasRect.left - this.actionState.offsetX!;
      let newY = event.clientY - canvasRect.top - this.actionState.offsetY!;
      newX = Math.max(
        CANVAS_MARGIN,
        Math.min(
          newX,
          canvasRect.width - this.liveLayoutItem.width - CANVAS_MARGIN
        )
      );
      newY = Math.max(
        CANVAS_MARGIN,
        Math.min(
          newY,
          canvasRect.height - this.liveLayoutItem.height - CANVAS_MARGIN
        )
      );
      this.liveLayoutItem = { ...this.liveLayoutItem, x: newX, y: newY };
    } else if (this.actionState.type === 'resize') {
      let newWidth = event.clientX - canvasRect.left - this.liveLayoutItem.x;
      let newHeight = event.clientY - canvasRect.top - this.liveLayoutItem.y;
      newWidth = Math.max(
        GRID_SIZE * 2,
        Math.min(
          newWidth,
          canvasRect.width - this.liveLayoutItem.x - CANVAS_MARGIN
        )
      );
      newHeight = Math.max(
        GRID_SIZE * 2,
        Math.min(
          newHeight,
          canvasRect.height - this.liveLayoutItem.y - CANVAS_MARGIN
        )
      );
      this.liveLayoutItem = {
        ...this.liveLayoutItem,
        width: newWidth,
        height: newHeight,
      };
    }
    this.cdr.detectChanges();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void {
    if (
      this.readOnly ||
      !this.actionState.type ||
      !this.actionState.fieldId ||
      !this.liveLayoutItem
    )
      return;
    const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();

    let snappedX = snapToGrid(this.liveLayoutItem.x);
    let snappedY = snapToGrid(this.liveLayoutItem.y);
    let snappedWidth = snapToGrid(this.liveLayoutItem.width);
    let snappedHeight = snapToGrid(this.liveLayoutItem.height);

    snappedX = Math.max(CANVAS_MARGIN, snappedX);
    snappedY = Math.max(CANVAS_MARGIN, snappedY);

    if (snappedX + snappedWidth > canvasRect.width - CANVAS_MARGIN) {
      snappedWidth = snapToGrid(canvasRect.width - CANVAS_MARGIN - snappedX);
    }
    if (snappedY + snappedHeight > canvasRect.height - CANVAS_MARGIN) {
      snappedHeight = snapToGrid(canvasRect.height - CANVAS_MARGIN - snappedY);
    }

    const finalItem = {
      ...this.liveLayoutItem,
      x: snappedX,
      y: snappedY,
      width: Math.max(GRID_SIZE * 2, snappedWidth),
      height: Math.max(GRID_SIZE * 2, snappedHeight),
    };

    const finalLayout = this.currentTemplate.layout.map((l) =>
      l.fieldId === this.actionState.fieldId ? finalItem : l
    );

    this.updateTemplateLayout(finalLayout);
    this.actionState = { type: null, fieldId: null };
    this.liveLayoutItem = null;
    this.cdr.detectChanges();
  }

  updateTemplateLayout(newLayout: EduFieldLayout[]): void {
    const newTemplates = this.model.cardTemplates.map((t) =>
      t.name === this.activeTemplate ? { ...t, layout: newLayout } : t
    );
    this.model = { ...this.model, cardTemplates: newTemplates };
  }

  handleSaveClick(): void {
    const finalModel = {
      ...this.model,
    };

    this.store.dispatch(FlashcardsActions.createModel({ model: finalModel }));
    console.log(finalModel);
    this.save.emit(finalModel);
  }

  toggleTemplate(): void {
    this.activeTemplate = this.activeTemplate === 'Front' ? 'Back' : 'Front';
  }
}
