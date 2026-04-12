export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Create a ResizeObserver that feeds container dimensions to a callback.
 * Returns a cleanup function.
 */
export function observeDimensions(
  element: Element,
  callback: (dims: Dimensions) => void,
): () => void {
  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    callback({ width: Math.floor(width), height: Math.floor(height) });
  });
  observer.observe(element);
  return () => observer.disconnect();
}

/** Compute inner dimensions from outer dimensions and margins */
export function innerDimensions(
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number },
) {
  return {
    innerWidth: Math.max(0, width - margin.left - margin.right),
    innerHeight: Math.max(0, height - margin.top - margin.bottom),
  };
}
