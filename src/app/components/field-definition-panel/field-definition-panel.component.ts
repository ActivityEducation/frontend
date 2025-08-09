import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// --- Type Definitions ---
export interface EduFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'image' | 'audio' | 'icon';
}

@Component({
  selector: 'app-field-definition-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './field-definition-panel.component.html',
  styleUrls: ['./field-definition-panel.component.scss'],
})
export class FieldDefinitionPanelComponent {
  @Input() fields: EduFieldDefinition[] = [];
  @Input() readOnly = false;
  @Output() fieldsChange = new EventEmitter<EduFieldDefinition[]>();

  public newFieldName = '';
  public newFieldType: 'text' | 'image' | 'audio' | 'icon' = 'text';

  handleAddField(): void {
    if (this.newFieldName.trim() && !this.readOnly) {
      const newField: EduFieldDefinition = {
        id: `field_${Date.now()}`,
        name: this.newFieldName.trim(),
        type: this.newFieldType,
      };
      this.fieldsChange.emit([...this.fields, newField]);
      this.newFieldName = '';
    }
  }

  handleDeleteField(id: string): void {
    if (this.readOnly) return;
    this.fieldsChange.emit(this.fields.filter((f) => f.id !== id));
  }

  onDragStart(event: DragEvent, fieldId: string): void {
    event.dataTransfer?.setData('fieldId', fieldId);
  }
}
