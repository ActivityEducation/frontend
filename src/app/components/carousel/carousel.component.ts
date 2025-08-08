import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScrollingModule, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, ScrollingModule, MatButtonModule, MatIconModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent<T> implements OnInit, OnDestroy {
  @Input() items$: Observable<T[]> | undefined;
  @Output() itemChange = new EventEmitter<T>();

  // Get a reference to the CdkVirtualScrollViewport component instance
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport | undefined;
  
  // This is the private property that will hold the element reference.
  private _viewportEl: ElementRef<HTMLElement> | undefined;

  /**
   * This is the key to the solution. By using a setter for the ViewChild query,
   * this code will only execute when the element referenced by #viewport
   * is actually created and inserted into the DOM by Angular.
   */
  @ViewChild('viewport', { read: ElementRef }) 
  set viewportEl(el: ElementRef<HTMLElement> | undefined) {
    if (el) {
      // The element is now available.
      this._viewportEl = el;
      // We can safely measure its width immediately.
      // A timeout ensures the browser has finished its layout calculations.
      setTimeout(() => this.updateViewportWidth());
    }
  }
  
  @ContentChild(TemplateRef) itemTemplate: TemplateRef<any> | undefined;

  public items: T[] = [];
  public currentIndex = 0;
  // This property will hold the measured width of the viewport and be bound to itemSize
  public viewportWidth = 0;
  private itemsSubscription: Subscription | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  // Listen for the window resize event to dynamically update the itemSize
  @HostListener('window:resize')
  onResize() {
    this.updateViewportWidth();
  }

  ngOnInit() {
    if (this.items$) {
      this.itemsSubscription = this.items$.subscribe(items => {
        this.items = items || [];
        // When items arrive, mark for check. The *ngIf will then create the viewport element,
        // which will trigger the ViewChild setter above.
        this.cdr.markForCheck();
      });
    }
  }
  
  /**
   * Measures the clientWidth of the viewport element and updates the viewportWidth property.
   */
  private updateViewportWidth(): void {
    if (this._viewportEl) {
      this.viewportWidth = this._viewportEl.nativeElement.clientWidth;
      // Trigger change detection because this can happen after the regular cycle
      this.cdr.detectChanges();
    }
  }

  public previous(): void {
    if (this.items.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.scrollToIndex(this.currentIndex, 'smooth');
  }

  public next(): void {
    if (this.items.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.scrollToIndex(this.currentIndex, 'smooth');
  }

  private scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (this.viewport && this.items.length > 0) {
      // After scrolling, emit the event to notify the parent.
      this.viewport.scrollToIndex(index, behavior);
      this.itemChange.emit(this.items[index]);
    }
  }

  ngOnDestroy(): void {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }
}
