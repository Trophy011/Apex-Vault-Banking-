/**
 * Professional Navigation & History Manager for Smooth Back/Forward Traversal
 * Allows tabs, modals, drawers, and full-screen views to be navigated gracefully
 * using the browser's back/forward buttons, Android back gesture, mouse 4/5 buttons, and Escape key,
 * matching the behavior of elite web applications (Stripe, Linear, Apple, GitHub).
 */

type CloseHandler = () => void;

interface ModalEntry {
  id: string;
  close: CloseHandler;
}

class NavHistoryManager {
  private stack: ModalEntry[] = [];
  private isProgrammaticBack = false;
  private isHandlingPopstate = false;
  private tabChangeListeners: Array<(tab: string) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', this.handlePopState.bind(this));
      window.addEventListener('keydown', this.handleKeyDown.bind(this));
      window.addEventListener('hashchange', this.handleHashChange.bind(this));
    }
  }

  /**
   * Register an open modal or full-screen view in browser history.
   */
  public pushModal(id: string, onClose: CloseHandler) {
    const existingIndex = this.stack.findIndex(entry => entry.id === id);
    if (existingIndex !== -1) {
      this.stack[existingIndex].close = onClose;
      return;
    }

    this.stack.push({ id, close: onClose });

    try {
      window.history.pushState({ modalId: id, navType: 'modal', timestamp: Date.now() }, '', window.location.href);
    } catch {
      // safe fallback
    }
  }

  /**
   * Remove a modal when closed via direct UI button (e.g. clicking 'X' or 'Back' button).
   * Rewinds the browser history cleanly if it was pushed.
   */
  public closeModal(id: string) {
    const index = this.stack.findIndex(entry => entry.id === id);
    if (index === -1) return;

    this.stack.splice(index, 1);

    // If we're not currently reacting to a browser 'popstate', step back one history state
    if (!this.isHandlingPopstate) {
      try {
        if (window.history.state && window.history.state.modalId === id) {
          this.isProgrammaticBack = true;
          window.history.back();
          setTimeout(() => {
            this.isProgrammaticBack = false;
          }, 60);
        }
      } catch {
        this.isProgrammaticBack = false;
      }
    }
  }

  /**
   * Browser back button or swipe-to-go-back listener
   */
  private handlePopState(e: PopStateEvent) {
    if (this.isProgrammaticBack) {
      this.isProgrammaticBack = false;
      return;
    }

    if (this.stack.length === 0) return;

    this.isHandlingPopstate = true;
    try {
      const topModal = this.stack.pop();
      if (topModal && typeof topModal.close === 'function') {
        topModal.close();
      }
    } finally {
      setTimeout(() => {
        this.isHandlingPopstate = false;
      }, 50);
    }
  }

  /**
   * Global Escape key listener to close topmost modal cleanly
   */
  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this.stack.length > 0) {
      const topModal = this.stack[this.stack.length - 1];
      if (topModal) {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal(topModal.id);
        topModal.close();
      }
    }
  }

  /**
   * Smooth Tab/Hash Navigation support
   */
  public pushTab(tabName: string) {
    try {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash !== tabName) {
        window.history.pushState({ tab: tabName, navType: 'tab' }, '', `#${tabName}`);
      }
    } catch {}
  }

  public replaceTab(tabName: string) {
    try {
      window.history.replaceState({ tab: tabName, navType: 'tab' }, '', `#${tabName}`);
    } catch {}
  }

  public onTabChange(listener: (tab: string) => void) {
    this.tabChangeListeners.push(listener);
    return () => {
      this.tabChangeListeners = this.tabChangeListeners.filter(l => l !== listener);
    };
  }

  private handleHashChange() {
    const newTab = window.location.hash.replace('#', '');
    if (newTab) {
      this.tabChangeListeners.forEach(l => l(newTab));
    }
  }
}

export const navHistory = new NavHistoryManager();
