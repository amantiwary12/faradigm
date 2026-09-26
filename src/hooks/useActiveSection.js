import { useEffect, useState } from 'react';
import { hasIntersectionObserver } from '../lib/env.js';

/** Returns the id of the section currently crossing the middle of the viewport. */
export default function useActiveSection(ids) {
  const [active, setActive] = useState('');

  useEffect(() => {
    if (!hasIntersectionObserver) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && setActive(en.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);

  return active;
}
