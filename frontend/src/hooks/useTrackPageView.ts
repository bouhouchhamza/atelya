import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from '../lib/api';

export function useTrackPageView() {
  const location = useLocation();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`;
    const referrer = previousPath.current ?? document.referrer ?? undefined;

    trackPageview({ path: currentPath, referrer });

    previousPath.current = currentPath;
  }, [location.pathname, location.search]);
}
