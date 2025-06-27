// MP-4: Fixed accessibility utilities with proper JSDOM support

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
      // Check if element is hidden via attributes
      if (element.hidden || element.hasAttribute('hidden')) return false;
      
      // In JSDOM environment, use simpler visibility checks
      if (typeof window !== 'undefined' && !window.getComputedStyle) {
        // JSDOM fallback - check basic visibility indicators
        return !element.hidden && 
               element.style.display !== 'none' && 
               element.style.visibility !== 'hidden';
      }
      
      // Full browser environment
      if (typeof window !== 'undefined' && window.getComputedStyle) {
        const style = window.getComputedStyle(element);
        if (
          style.display === 'none' ||
          style.visibility === 'hidden' ||
          style.opacity === '0'
        ) {
          return false;
        }
      }
      
      // Check if element is off-screen (only in real browser)
      if (typeof window !== 'undefined' && element.offsetParent !== undefined) {
        if (element.offsetParent === null && element.tagName !== 'BODY') {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.warn('Error checking element visibility:', error);
      return true; // Default to visible if we can't determine
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
    
    // Focus first element initially
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
