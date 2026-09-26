import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo-small.webp';
import { cn } from '../../lib/env.js';

/** Brand logo linking home. `plate` gives it a white ground for dark sections. */
export default function Logo({ plate = false, priority = false, className }) {
  const [failed, setFailed] = useState(false);
  const { pathname, hash } = useLocation();
  // Already on the home page: a plain <Link> would do nothing, so scroll up instead
  const toTop = () => pathname === '/' && !hash && window.scrollTo({ top: 0, behavior: 'smooth' });
  return (
    <Link to="/" onClick={toTop} aria-label="Faradigm home" className={cn('flex shrink-0 items-center', plate && 'inline-flex bg-white px-3 py-[7px]', className)}>
      {failed ? (
        <span className="font-display text-[22px] font-extrabold text-brand-red italic">FaraDigm®</span>
      ) : (
        <img
          src={logo}
          alt="Faradigm® logo"
          width="300"
          height="100"
          className={cn('h-9 w-auto max-sm:h-[30px]', !plate && 'mix-blend-multiply')}
          {...(priority ? { fetchPriority: 'high' } : { loading: 'lazy', decoding: 'async' })}
          onError={() => setFailed(true)}
        />
      )}
    </Link>
  );
}
