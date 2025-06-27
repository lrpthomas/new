// src/__tests__/accessibility.test.ts
// MP-4: test: comprehensive accessibility system tests

import {
  AriaLiveManager,
  FocusManager,
  KeyboardNavigationHandler,
  AriaAttributeManager,
  ScreenReaderUtils,
  AccessibilityManager
} from '../utils/accessibility';

describe('MP-4: Accessibility System', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // Create test container
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Clean up
    document.body.removeChild(container);
    
    // Remove any live regions
    const liveRegions = document.querySelectorAll('[aria-live]');
    liveRegions.forEach(region => region.remove());
  });

  describe('AriaLiveManager', () => {
    let ariaLive: AriaLiveManager;

    beforeEach(() => {
      ariaLive = new AriaLiveManager();
    });

    it('should create live regions', () => {
      const politeRegion = document.getElementById('aria-live-polite');
      const assertiveRegion = document.getElementById('aria-live-assertive');
      
      expect(politeRegion).toBeTruthy();
      expect(assertiveRegion).toBeTruthy();
      expect(politeRegion?.getAttribute('aria-live')).toBe('polite');
      expect(assertiveRegion?.getAttribute('aria-live')).toBe('assertive');
    });

    it('should announce messages', (done) => {
      ariaLive.announce('Test message', 'polite');
      
      setTimeout(() => {
        const politeRegion = document.getElementById('aria-live-polite');
        expect(politeRegion?.textContent).toBe('Test message');
        done();
      }, 150);
    });

    it('should announce map actions', () => {
      ariaLive.announceMapAction('Zoom in', 'Map zoomed in');
      
      setTimeout(() => {
        const politeRegion = document.getElementById('aria-live-polite');
        expect(politeRegion?.textContent).toBe('Zoom in: Map zoomed in');
      }, 150);
    });
  });

  describe('FocusManager', () => {
    let focusManager: FocusManager;
    let button1: HTMLButtonElement;
    let button2: HTMLButtonElement;

    beforeEach(() => {
      focusManager = new FocusManager();
      
      button1 = document.createElement('button');
      button1.textContent = 'Button 1';
      button2 = document.createElement('button');
      button2.textContent = 'Button 2';
      
      container.appendChild(button1);
      container.appendChild(button2);
    });

    it('should manage focus stack', () => {
      button1.focus();
      focusManager.pushFocus(button2);
      
      expect(document.activeElement).toBe(button2);
      
      focusManager.popFocus();
      expect(document.activeElement).toBe(button1);
    });

    it('should find focusable elements', () => {
      const focusableElements = focusManager.getFocusableElements(container);
      expect(focusableElements).toHaveLength(2);
      expect(focusableElements).toContain(button1);
      expect(focusableElements).toContain(button2);
    });

    it('should focus first element in container', () => {
      const success = focusManager.focusFirst(container);
      expect(success).toBe(true);
      expect(document.activeElement).toBe(button1);
    });

    it('should focus last element in container', () => {
      const success = focusManager.focusLast(container);
      expect(success).toBe(true);
      expect(document.activeElement).toBe(button2);
    });
  });

  describe('AriaAttributeManager', () => {
    it('should enhance form elements', () => {
      const input = document.createElement('input');
      input.id = 'test-input';
      container.appendChild(input);

      AriaAttributeManager.enhanceFormElement(input, {
        label: 'Test Input',
        description: 'This is a test input',
        required: true,
        invalid: false
      });

      expect(input.getAttribute('aria-label')).toBe('Test Input');
      expect(input.getAttribute('aria-required')).toBe('true');
      expect(input.getAttribute('aria-invalid')).toBe('false');
      expect(input.getAttribute('aria-describedby')).toContain('test-input-desc');
    });

    it('should enhance buttons', () => {
      const button = document.createElement('button');
      container.appendChild(button);

      AriaAttributeManager.enhanceButton(button, {
        expanded: true,
        controls: 'menu',
        popup: true
      });

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(button.getAttribute('aria-controls')).toBe('menu');
      expect(button.getAttribute('aria-haspopup')).toBe('true');
    });
  });

  describe('ScreenReaderUtils', () => {
    it('should create screen reader only elements', () => {
      const element = ScreenReaderUtils.createSROnlyElement('Hidden text');
      
      expect(element.className).toBe('sr-only');
      expect(element.textContent).toBe('Hidden text');
    });

    it('should create marker descriptions', () => {
      const marker = {
        name: 'Test Marker',
        position: { lat: 47.6062, lng: -122.3321 },
        description: 'Test description',
        status: 'active'
      };

      const description = ScreenReaderUtils.createMarkerDescription(marker);
      
      expect(description).toContain('Test Marker');
      expect(description).toContain('47.6062');
      expect(description).toContain('-122.3321');
      expect(description).toContain('active');
      expect(description).toContain('Test description');
    });
  });

  describe('AccessibilityManager', () => {
    it('should initialize all components', () => {
      const manager = new AccessibilityManager();
      
      expect(manager.ariaLive).toBeInstanceOf(AriaLiveManager);
      expect(manager.focusManager).toBeInstanceOf(FocusManager);
      expect(manager.keyboardHandler).toBeInstanceOf(KeyboardNavigationHandler);
    });

    it('should add accessibility styles', () => {
      new AccessibilityManager();
      
      const styles = document.getElementById('accessibility-styles');
      expect(styles).toBeTruthy();
      expect(styles?.textContent).toContain('.sr-only');
    });
  });
});
