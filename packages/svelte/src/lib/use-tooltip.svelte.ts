export interface TooltipState<T = unknown> {
  visible: boolean;
  x: number;
  y: number;
  data: T | null;
}

export function useTooltip<T = unknown>() {
  let visible = $state(false);
  let x = $state(0);
  let y = $state(0);
  let data = $state<T | null>(null);

  function show(event: MouseEvent | FocusEvent, datum: T) {
    const rect = (event.currentTarget as Element)?.closest('svg')?.getBoundingClientRect();
    if (!rect) return;

    if (event instanceof MouseEvent) {
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
    } else {
      const target = event.target as Element;
      const bbox = target.getBoundingClientRect();
      x = bbox.left + bbox.width / 2 - rect.left;
      y = bbox.top - rect.top;
    }
    data = datum;
    visible = true;
  }

  function hide() {
    visible = false;
    data = null;
  }

  return {
    get visible() { return visible; },
    get x() { return x; },
    get y() { return y; },
    get data() { return data; },
    show,
    hide,
  };
}
