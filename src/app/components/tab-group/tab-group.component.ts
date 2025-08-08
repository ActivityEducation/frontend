import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Type Definitions ---
export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
}

export type TabGroupVariant = 'underline' | 'pill';

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss']
})
export class TabGroupComponent implements OnInit, OnChanges {
  /**
   * An array of tab objects to be displayed.
   */
  @Input() tabs: Tab[] = [];

  /**
   * The ID of the tab that should be selected by default.
   * If not provided, the first tab will be selected.
   */
  @Input() defaultTab?: string;

  /**
   * The visual style of the tab group.
   * @default 'underline'
   */
  @Input() variant: TabGroupVariant = 'underline';

  /**
   * Emits the newly selected tab object whenever the active tab changes.
   */
  @Output() tabChange = new EventEmitter<Tab>();

  public activeTabId: string | null = null;

  ngOnInit(): void {
    this.setActiveTab();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If the tabs array changes, we might need to reset the active tab.
    if (changes['tabs'] || changes['defaultTab']) {
      this.setActiveTab();
    }
  }

  private setActiveTab(): void {
    if (this.tabs && this.tabs.length > 0) {
      // Check if the defaultTab is a valid, non-disabled tab
      const defaultTabExists = this.tabs.some(tab => tab.id === this.defaultTab && !tab.disabled);
      
      if (this.defaultTab && defaultTabExists) {
        this.activeTabId = this.defaultTab;
      } else {
        // Otherwise, select the first available (non-disabled) tab
        const firstAvailableTab = this.tabs.find(tab => !tab.disabled);
        this.activeTabId = firstAvailableTab ? firstAvailableTab.id : null;
      }
    } else {
      this.activeTabId = null;
    }
  }

  selectTab(tab: Tab): void {
    if (tab.disabled || tab.id === this.activeTabId) {
      return;
    }
    this.activeTabId = tab.id;
    this.tabChange.emit(tab);
  }
}
