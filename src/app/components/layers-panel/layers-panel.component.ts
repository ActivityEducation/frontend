import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EduFieldDefinition } from '../field-definition-panel/field-definition-panel.component';
import { EduFieldLayout } from '../../types/srs.types';

@Component({
  selector: 'app-layers-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './layers-panel.component.html',
  styleUrls: ['./layers-panel.component.scss'],
})
export class LayersPanelComponent {
  @Input() layers: EduFieldLayout[] = [];
  @Input() fields: EduFieldDefinition[] = [];
  @Output() layersChange = new EventEmitter<EduFieldLayout[]>();

  private draggingIndex: number | null = null;

  getFieldById(id: string): EduFieldDefinition | undefined {
    return this.fields.find((f) => f.id === id);
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggingIndex = index;
    event.dataTransfer?.setData('text/plain', index.toString());
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    if (this.draggingIndex === null) return;

    const draggedItem = this.layers[this.draggingIndex];
    const newLayers = [...this.layers];
    newLayers.splice(this.draggingIndex, 1);
    newLayers.splice(dropIndex, 0, draggedItem);

    this.layersChange.emit(newLayers);
    this.draggingIndex = null;
  }
}
