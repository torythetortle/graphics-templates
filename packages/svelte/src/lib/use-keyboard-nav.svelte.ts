import { handleChartKeydown, announce } from '@graphics-templates/core/a11y';

interface UseKeyboardNavOpts {
  count: () => number;
  onFocus?: (index: number) => void;
  formatAnnouncement?: (index: number) => string;
}

export function useKeyboardNav(opts: UseKeyboardNavOpts) {
  let current = $state(0);
  let active = $state(false);

  function onKeydown(e: KeyboardEvent) {
    const handled = handleChartKeydown(e, {
      count: opts.count(),
      current,
      onNavigate(index) {
        current = index;
        opts.onFocus?.(index);
        if (opts.formatAnnouncement) {
          announce(opts.formatAnnouncement(index));
        }
      },
      onActivate(index) {
        if (opts.formatAnnouncement) {
          announce(opts.formatAnnouncement(index), 'assertive');
        }
      },
      onExit() {
        active = false;
      },
    });

    if (handled) e.preventDefault();
  }

  function enter() {
    active = true;
    current = 0;
  }

  return {
    get current() { return current; },
    get active() { return active; },
    onKeydown,
    enter,
  };
}
