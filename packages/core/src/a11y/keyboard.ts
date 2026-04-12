export interface KeyboardNavConfig {
  /** Total number of navigable items */
  count: number;
  /** Current focused index */
  current: number;
  /** Callback when index changes */
  onNavigate: (index: number) => void;
  /** Callback when item is activated (Enter/Space) */
  onActivate?: (index: number) => void;
  /** Callback when navigation exits (Escape) */
  onExit?: () => void;
  /** Enable wrap-around at boundaries */
  wrap?: boolean;
}

/**
 * Handle keydown events for chart data point navigation.
 * Returns true if the event was handled (caller should preventDefault).
 */
export function handleChartKeydown(e: KeyboardEvent, config: KeyboardNavConfig): boolean {
  const { count, current, onNavigate, onActivate, onExit, wrap = true } = config;
  if (count === 0) return false;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown': {
      const next = current + 1;
      if (next < count) onNavigate(next);
      else if (wrap) onNavigate(0);
      return true;
    }
    case 'ArrowLeft':
    case 'ArrowUp': {
      const prev = current - 1;
      if (prev >= 0) onNavigate(prev);
      else if (wrap) onNavigate(count - 1);
      return true;
    }
    case 'Home':
      onNavigate(0);
      return true;
    case 'End':
      onNavigate(count - 1);
      return true;
    case 'Enter':
    case ' ':
      onActivate?.(current);
      return true;
    case 'Escape':
      onExit?.();
      return true;
    default:
      return false;
  }
}
