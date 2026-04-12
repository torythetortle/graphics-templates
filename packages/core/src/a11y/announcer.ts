let liveRegion: HTMLElement | null = null;

function ensureRegion(): HTMLElement {
  if (liveRegion) return liveRegion;
  if (typeof document === 'undefined') {
    throw new Error('announcer requires a DOM environment');
  }

  liveRegion = document.createElement('div');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  Object.assign(liveRegion.style, {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: '0',
  });
  document.body.appendChild(liveRegion);
  return liveRegion;
}

/** Announce a message to screen readers via a live region */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const region = ensureRegion();
  region.setAttribute('aria-live', priority);
  // Clear then set to ensure re-announcement of identical messages
  region.textContent = '';
  requestAnimationFrame(() => {
    region.textContent = message;
  });
}
