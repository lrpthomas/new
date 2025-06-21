import { expect, describe, it } from '@jest/globals';

function trapFocus(modalElement: HTMLElement): () => void {
  if (!modalElement) return () => {};

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusableElements = Array.from(modalElement.querySelectorAll<HTMLElement>(focusableSelectors)).filter(el => !('disabled' in el && (el as HTMLButtonElement).disabled));
  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const previouslyFocused = document.activeElement as HTMLElement | null;

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    if (e.key === 'Escape') {
      const closeBtn = modalElement.querySelector<HTMLElement>('.close-modal');
      if (closeBtn) closeBtn.click();
    }
  }

  modalElement.addEventListener('keydown', handleKeydown);
  if (first) first.focus();

  return function cleanup() {
    modalElement.removeEventListener('keydown', handleKeydown);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
  };
}

describe('trapFocus', () => {
  it('loops focus within modal and closes on Escape', () => {
    document.body.innerHTML = `
      <div id="modal">
        <button class="close-modal">Close</button>
        <button id="second">Second</button>
      </div>
    `;
    const modal = document.getElementById('modal') as HTMLElement;
    let closed = false;
    modal.querySelector('.close-modal')?.addEventListener('click', () => { closed = true; });

    const cleanup = trapFocus(modal);
    const focusable = Array.from(modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    expect(document.activeElement).toBe(first);

    last.focus();
    last.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(document.activeElement).toBe(first);

    first.focus();
    first.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true }));
    expect(document.activeElement).toBe(last);

    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(closed).toBe(true);

    cleanup();
  });
});
