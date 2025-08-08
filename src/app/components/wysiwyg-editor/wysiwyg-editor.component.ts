import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnDestroy, HostListener, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ActiveStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeThrough: boolean;
  link: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  justify: boolean;
  blockquote: boolean;
  bulletList: boolean;
  orderedList: boolean;
  [key: string]: boolean;
}

@Component({
  selector: 'app-wysiwyg-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss']
})
export class WysiwygEditorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() placeholder = 'Start typing...';
  @Input() initialContent = '';
  @Output() contentChange = new EventEmitter<string>();

  @ViewChild('editor') private editorRef!: ElementRef<HTMLDivElement>;

  public activeStyles: ActiveStyles = this.getInitialActiveStyles();
  public currentBlockFormat = 'p';
  public linkInputVisible = false;
  public linkUrl = '';
  public alignmentMenuVisible = false;

  private savedSelection: Range | null = null;
  private selectionChangeObserver: MutationObserver | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialContent'] && this.editorRef) {
      this.editorRef.nativeElement.innerHTML = this.initialContent || '';
    }
  }

  ngAfterViewInit(): void {
    if (this.initialContent) {
      this.editorRef.nativeElement.innerHTML = this.initialContent;
    }
    document.addEventListener('selectionchange', this.onSelectionChange);
  }

  ngOnDestroy(): void {
    document.removeEventListener('selectionchange', this.onSelectionChange);
  }

  onSelectionChange = (): void => {
    this.saveSelection();
    this.updateActiveStyles();
  }

  execCommand(command: string, value?: string): void {
    this.restoreSelection();
    if (document.queryCommandSupported(command)) {
      document.execCommand(command, false, value);
    }
    this.updateActiveStyles();
    this.onContentChange();
  }
  
  onContentChange(): void {
    const html = this.editorRef.nativeElement.innerHTML;
    this.contentChange.emit(html);
  }

  onEditorBlur(): void {
    this.saveSelection();
    if (this.editorRef.nativeElement.innerHTML.trim() === '<br>') {
      this.editorRef.nativeElement.innerHTML = '';
    }
    this.onContentChange();
  }

  private saveSelection(): void {
    if (window.getSelection && (window.getSelection()?.rangeCount ?? 0) > 0) {
      this.savedSelection = window.getSelection()?.getRangeAt(0) ?? null;
    }
  }

  private restoreSelection(): void {
    if (this.savedSelection && this.editorRef.nativeElement) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(this.savedSelection);
        this.editorRef.nativeElement.focus();
      }
    }
  }

  private updateActiveStyles(): void {
    this.activeStyles = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      link: this.isLinkActive(),
      alignLeft: document.queryCommandState('justifyLeft'),
      alignCenter: document.queryCommandState('justifyCenter'),
      alignRight: document.queryCommandState('justifyRight'),
      justify: document.queryCommandState('justifyFull'),
      blockquote: document.queryCommandState('formatBlock') && this.getCurrentBlockFormat() === 'blockquote',
      bulletList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    };
    this.currentBlockFormat = this.getCurrentBlockFormat();
  }
  
  private isLinkActive(): boolean {
      if (!window.getSelection) return false;
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;
      let node = selection.getRangeAt(0).commonAncestorContainer;
      while (node && node !== this.editorRef.nativeElement) {
          if (node.nodeName === 'A') {
              return true;
          }
          node = node.parentNode!;
      }
      return false;
  }

  private getCurrentBlockFormat(): string {
    if (!window.getSelection) return 'p';
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 'p';
    let node = selection.getRangeAt(0).commonAncestorContainer;
    while (node && node !== this.editorRef.nativeElement) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = (node as HTMLElement).tagName.toLowerCase();
        if (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'blockquote'].includes(tagName)) {
          return tagName;
        }
      }
      node = node.parentNode!;
    }
    return 'p';
  }

  handleLinkClick(): void {
    if (this.activeStyles.link) {
      this.execCommand('unlink');
    } else {
      this.saveSelection();
      this.linkInputVisible = true;
    }
  }

  confirmLink(): void {
    this.restoreSelection();
    if (this.linkUrl.trim()) {
      this.execCommand('createLink', this.linkUrl);
    }
    this.linkInputVisible = false;
    this.linkUrl = '';
  }

  cancelLink(): void {
    this.linkInputVisible = false;
    this.linkUrl = '';
  }

  toggleAlignmentMenu(): void {
    this.alignmentMenuVisible = !this.alignmentMenuVisible;
  }

  get activeAlignmentIcon(): string {
    if(this.activeStyles.alignCenter) return 'format_align_center';
    if(this.activeStyles.alignRight) return 'format_align_right';
    if(this.activeStyles.justify) return 'format_align_justify';
    return 'format_align_left';
  }
  
  private getInitialActiveStyles(): ActiveStyles {
      return {
          bold: false, italic: false, underline: false, strikeThrough: false,
          link: false, alignLeft: false, alignCenter: false, alignRight: false,
          justify: false, blockquote: false, bulletList: false, orderedList: false,
      };
  }
}
