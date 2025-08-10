import { Component, Input, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Constants for Scaling ---
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 48;

@Component({
  selector: 'app-dynamic-text-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-text-field.component.html',
  styleUrls: ['./dynamic-text-field.component.scss']
})
export class DynamicTextFieldComponent implements AfterViewInit, OnChanges {
  @Input() text = '';

  @ViewChild('textContainer') textContainerRef!: ElementRef<HTMLDivElement>;

  public isOverflowing = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.textContainerRef) {
      this.adjustFontSize();
    }
  }

  ngAfterViewInit(): void {
    this.adjustFontSize();
  }

  private adjustFontSize(): void {
    if (!this.textContainerRef?.nativeElement || !this.text) return;

    const container = this.textContainerRef.nativeElement;
    const isSingleWord = !this.text.includes(' ');

    container.style.whiteSpace = isSingleWord ? 'nowrap' : 'normal';

    let currentFontSize = MAX_FONT_SIZE;
    container.style.fontSize = `${currentFontSize}px`;
    container.style.lineHeight = `${currentFontSize + 4}px`;

    // Shrink font size until content fits
    while (
      (container.scrollHeight > (container.clientHeight) || container.scrollWidth > (container.clientWidth)) &&
      currentFontSize > MIN_FONT_SIZE
    ) {
      currentFontSize--;
      container.style.fontSize = `${currentFontSize}px`;
      container.style.lineHeight = `${currentFontSize + 4}px`;
    }

    if (isSingleWord) {
      container.style.whiteSpace = 'normal';
    }

    // Final check for overflow to set title attribute
    this.isOverflowing = container.scrollHeight > container.clientHeight || container.scrollWidth > container.clientWidth;
  }
}
