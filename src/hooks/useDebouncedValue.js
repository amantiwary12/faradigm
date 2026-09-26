import { useEffect, useState } from 'react';

/**
 * Returns `value`, but only after it has stopped changing for `delay` ms. Each change restarts
 * the timer and the cleanup cancels the previous one, so a burst of keystrokes yields one update
 * (and nothing fires after unmount).
 */
export default function useDebouncedValue(value, delay = 200) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
