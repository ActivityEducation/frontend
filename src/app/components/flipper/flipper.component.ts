import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-flipper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flipper.component.html',
  styleUrls: ['./flipper.component.scss']
})
export class FlipperComponent implements OnChanges {
  // --- Inputs & Outputs ---

  /**
   * If true, the card will initially be flipped to its back side.
   * Use this for uncontrolled behavior.
   * @default false
   */
  @Input() defaultFlipped = false;

  /**
   * Controls the flipped state of the card (true for back, false for front).
   * Use this for controlled behavior.
   */
  @Input() isFlipped?: boolean;

  /**
   * Callback function that is called when the card's flipped state changes.
   */
  @Output() flipChange = new EventEmitter<boolean>();

  /**
   * The duration of the flip animation in seconds.
   * @default 0.6
   */
  @Input() duration = 0.6;

  /**
   * The direction of the flip animation.
   * @default 'horizontal'
   */
  @Input() flipDirection: 'horizontal' | 'vertical' = 'horizontal';

  /**
   * If true, the card will flip when clicked.
   * @default true
   */
  @Input() flipOnClick = true;

  // --- Content Projection ---

  /**
   * Use `<ng-template #front>` to define the content for the front side.
   */
  @ContentChild('front') frontContent!: TemplateRef<any>;

  /**
   * Use `<ng-template #back>` to define the content for the back side.
   */
  @ContentChild('back') backContent!: TemplateRef<any>;

  // --- Component State ---
  public effectiveIsFlipped = false;
  private internalIsFlipped = false;

  ngOnInit(): void {
    this.internalIsFlipped = this.defaultFlipped;
    this.updateEffectiveState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the controlled input `isFlipped` changes, update the state.
    if (changes['isFlipped']) {
      this.updateEffectiveState();
    }
  }

  private updateEffectiveState(): void {
    // A controlled value (`isFlipped`) always takes precedence.
    this.effectiveIsFlipped = this.isFlipped !== undefined ? this.isFlipped : this.internalIsFlipped;
  }

  handleClick(): void {
    if (this.flipOnClick) {
      this.toggleFlip();
    }
  }

  private toggleFlip(): void {
    const newFlippedState = !this.effectiveIsFlipped;

    // If the component is uncontrolled, update its internal state.
    if (this.isFlipped === undefined) {
      this.internalIsFlipped = newFlippedState;
      this.updateEffectiveState();
    }

    // Always emit the change for parent components.
    this.flipChange.emit(newFlippedState);
  }
}
