import { useEffect, useState } from 'react';

/**
 * Subscribes to scroll/resize and keeps `select()` in state. Because state only changes when
 * the selected value does, a boolean or rounded-percent selector re-renders rarely.
 * `select` must be a stable (module-level) function.
 */
export default function useScrollValue(select) {
  const [value, setValue] = useState(() => (typeof window === 'undefined' ? select(0) : select()));

  useEffect(() => {
    const update = () => setValue(select());
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [select]);

  return value;
}
