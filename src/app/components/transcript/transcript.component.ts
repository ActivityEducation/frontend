import { Component, Input, ViewChildren, QueryList, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Type Definitions ---
export interface TranscriptSegment {
  id: string;
  text: string;
  start: number;
  end: number;
}

@Component({
  selector: 'app-transcript',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transcript.component.html',
  styleUrls: ['./transcript.component.scss']
})
export class TranscriptComponent implements OnChanges {
  /**
   * An array of transcript segments to display.
   */
  @Input() transcript: TranscriptSegment[] = [];

  /**
   * The current playback time of the video in seconds.
   */
  @Input() currentTime = 0;

  /**
   * QueryList to get all the DOM elements for the transcript items.
   */
  @ViewChildren('segmentItem') private itemElements!: QueryList<ElementRef<HTMLLIElement>>;

  public activeSegment: TranscriptSegment | null = null;
  private lastScrolledSegmentId: string | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // React to changes in currentTime or the transcript itself.
    if (changes['currentTime'] || changes['transcript']) {
      this.updateActiveSegment();
    }
  }

  private updateActiveSegment(): void {
    const newActiveSegment = this.transcript.find(
      (segment) => this.currentTime >= segment.start && this.currentTime < segment.end
    ) || null;

    if (newActiveSegment && newActiveSegment.id !== this.activeSegment?.id) {
      this.activeSegment = newActiveSegment;
      this.scrollToActiveSegment();
    } else if (!newActiveSegment && this.activeSegment) {
      this.activeSegment = null;
    }
  }

  private scrollToActiveSegment(): void {
    if (!this.activeSegment || this.activeSegment.id === this.lastScrolledSegmentId) {
      return;
    }

    // Use a timeout to ensure the DOM has updated with the new active class before scrolling.
    setTimeout(() => {
      const activeElement = this.itemElements?.find(
        (el) => el.nativeElement.getAttribute('data-segment-id') === this.activeSegment?.id
      );

      if (activeElement) {
        activeElement.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        this.lastScrolledSegmentId = this.activeSegment!.id;
      }
    }, 0);
  }
}
