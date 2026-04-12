import { observeDimensions, type Dimensions } from '@graphics-templates/core/responsive';

/**
 * Reactive container dimensions using ResizeObserver.
 * Usage: const dims = useDimensions(() => containerEl);
 */
export function useDimensions(getElement: () => Element | null) {
  let width = $state(0);
  let height = $state(0);

  $effect(() => {
    const el = getElement();
    if (!el) return;
    return observeDimensions(el, (d: Dimensions) => {
      width = d.width;
      height = d.height;
    });
  });

  return {
    get width() { return width; },
    get height() { return height; },
  };
}
