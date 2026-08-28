import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Boolean form of the framer-motion hook, safe to use in plain logic. */
export function useReducedMotionPref() {
  return !!useReducedMotion();
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Scroll helper that honours prefers-reduced-motion. */
export function scrollToId(id, reduced) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}
