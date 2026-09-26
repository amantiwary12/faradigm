import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On navigation: jump to the top of the new page, or, when the link has a #hash, scroll to
 * that element once it has rendered (retrying briefly, since the page may still be mounting).
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return undefined;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const seek = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (tries++ < 30) timer = setTimeout(seek, 50);
    };
    seek();
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
