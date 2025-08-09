import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EduFieldDefinition } from '../field-definition-panel/field-definition-panel.component';

@Component({
  selector: 'app-available-fields',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './available-fields.component.html',
  styleUrls: ['./available-fields.component.scss'],
})
export class AvailableFieldsComponent {
  @Input() fields: EduFieldDefinition[] = [];
  @Input() readOnly = false;

  onDragStart(event: DragEvent, fieldId: string): void {
    event.dataTransfer?.setData('fieldId', fieldId);
  }
}
