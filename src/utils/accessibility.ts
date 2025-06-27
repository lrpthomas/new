// MP-4: Complete accessibility implementation with proper exports
export interface AccessibilityOptions {
  announceChanges?: boolean;
  focusManagement?: boolean;
  keyboardNavigation?: boolean;
}

export class FocusManager {
  private focusableSelectors = [
    'button:not([disabled])',
    '[href]:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    '[contenteditable="true"]:not([disabled])'
  ].join(', ');

  getFocusableElements(container: Element): HTMLElement[] {
    if (!container) return [];
    
    try {
      const elements = Array.from(
        container.querySelectorAll<HTMLElement>(this.focusableSelectors)
      );
      
      return elements.filter(element => {
        return element && this.isVisible(element) && !this.isDisabled(element);
      });
    } catch (error) {
      console.warn('Error getting focusable elements:', error);
      return [];
    }
  }

  private isVisible(element: HTMLElement): boolean {
    if (!element) return false;
    
    try {
      if (element.hidden || element.hasAttribute('hidden')) return false;
      
      // JSDOM-compatible visibility check
      if (typeof window !== 'undefined') {
        // In test environment (JSDOM), use simpler checks
        if (!window.getComputedStyle || !element.getClientRects) {
          return !element.hidden && 
                 element.style.display !== 'none' && 
                 element.style.visibility !== 'hidden';
        }
        
        // Full browser environment
        const style = window.getComputedStyle(element);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.warn('Error checking element visibility:', error);
      return true;
    }
  }

  private isDisabled(element: HTMLElement): boolean {
    return element.hasAttribute('disabled') || 
           (element as any).disabled === true ||
           element.getAttribute('aria-disabled') === 'true';
  }

  focusFirst(container: Element): boolean {
    try {
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        return true;
      }
    } catch (error) {
      console.warn('Error focusing first element:', error);
    }
    return false;
  }

  focusLast(container: Element): boolean {
    try {
      const focusableElements = this.getFocusableElements(container);
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
        return true;
      }
    } catch (error) {
      console.warn('Error focusing last element:', error);
    }
    return false;
  }

  trapFocus(container: Element): () => void {
    if (!container) return () => {};
    
    let isActive = true;
    
    const handleTabKey = (event: KeyboardEvent) => {
      if (!isActive || event.key !== 'Tab') return;
      
      try {
        const focusableElements = this.getFocusableElements(container);
        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      } catch (error) {
        console.warn('Error in focus trap:', error);
      }
    };

    container.addEventListener('keydown', handleTabKey);
    this.focusFirst(container);

    return () => {
      isActive = false;
      container.removeEventListener('keydown', handleTabKey);
    };
  }

  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof document === 'undefined') return;
    
    try {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.style.cssText = `
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      `;
      
      document.body.appendChild(announcement);
      announcement.textContent = message;
      
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    } catch (error) {
      console.warn('Error announcing to screen reader:', error);
    }
  }
}

// Additional classes expected by tests
export class AriaLiveManager {
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    focusManager.announceToScreenReader(message, priority);
  }
}

export class KeyboardNavigationHandler {
  handleKeyDown(event: KeyboardEvent, actions: Record<string, () => void>) {
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  }
}

export class AriaAttributeManager {
  static setRole(element: HTMLElement, role: string) {
    element.setAttribute('role', role);
  }
  
  static setLabel(element: HTMLElement, label: string) {
    element.setAttribute('aria-label', label);
  }
}

export class ScreenReaderUtils {
  static createLiveRegion(priority: 'polite' | 'assertive' = 'polite') {
    const region = document.createElement('div');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    return region;
  }
}

export class AccessibilityManager {
  private focusManager = new FocusManager();
  
  setupAccessibility(container: Element) {
    return this.focusManager.trapFocus(container);
  }
}

// Global instances for backward compatibility
export const focusManager = new FocusManager();

// Legacy exports
export function trapFocus(modalElement: HTMLElement | null): () => void {
  if (!modalElement) return () => {};
  return focusManager.trapFocus(modalElement);
}

export function announceToScreenReader(message: string): void {
  focusManager.announceToScreenReader(message);
}
