import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  // Use ViewEncapsulation.None to allow global styles to affect projected content if needed,
  // or keep it emulated (default) for better style isolation.
  encapsulation: ViewEncapsulation.None,
})
export class CardComponent {
  /**
   * The title to be displayed in the card's header.
   */
  @Input() title?: string;

  /**
   * A custom template reference (`<ng-template #header>`) to be used for the header content.
   * This will override the default title.
   */
  @Input() header?: TemplateRef<any>;
}
